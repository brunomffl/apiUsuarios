import fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DATABASE_PATH = fileURLToPath(new URL("../data/database.json", import.meta.url))
const DATABASE_DIR = path.dirname(DATABASE_PATH);

type DatabaseTable = Record<string, any>;
type Filters = Record<string, string>;

export class Database {
    #database: Record<string, DatabaseTable[]> = {};
    #initialized: boolean = false;
    #initPromise: Promise<void>;

    constructor() {
        this.#initPromise = this.#ensureDatabaseFile().then(() => {
            this.#initialized = true;
        });
    }

    async #ensureDatabaseFile() {
        try {
            await fs.mkdir(DATABASE_DIR, { recursive: true });
            const data = await fs.readFile(DATABASE_PATH, 'utf8');
            this.#database = JSON.parse(data);
            
            let modificado = false;
            for (const table in this.#database) {
                if (Array.isArray(this.#database[table])) {
                    this.#database[table] = this.#database[table].map(item => {
                        if (!item.id) {
                            modificado = true;
                            return { id: randomUUID(), ...item };
                        }
                        return item;
                    });
                }
            }
            
            if (modificado) {
                await this.#persist();
            }
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                await this.#persist();
            } else {
                console.error('Erro ao inicializar o banco de dados:', error);
            }
        }
    }

    async #ensureInitialized() {
        if (!this.#initialized) {
            await this.#initPromise;
        }
    }

    async #persist() {
        try {
            await fs.writeFile(DATABASE_PATH, JSON.stringify(this.#database, null, 2));
        } catch (err) {
            console.error('Erro ao persistir o banco de dados:', err);
        }
    }
    
    async insert(table: string, data: DatabaseTable) {
        await this.#ensureInitialized();
        
        const newData = { id: randomUUID(), ...data };
    
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(newData);
        } else {
            this.#database[table] = [newData];
        }
    
        await this.#persist();
        return newData;
    }

    async select(table: string, filters?: Filters) {
        await this.#ensureInitialized();
        
        let data = this.#database[table] ?? [];

        if (filters) {
            data = data.filter((row) => {
                return Object.entries(filters).every(([key, value]) => {
                    return row[key]?.toString().toLowerCase().includes(value.toLowerCase());
                });
            });
        }

        return data;
    }

    async update(table: string, id: string, data: Partial<DatabaseTable>) {
        await this.#ensureInitialized();
        
        const rowIndex = this.#database[table]?.findIndex((row) => row.id === id);

        if (rowIndex > -1) {
            this.#database[table][rowIndex] = {
                ...this.#database[table][rowIndex],
                ...data
            };
            await this.#persist();
        }
    }

    async delete(table: string, id: string) {
        await this.#ensureInitialized();
        
        const rowIndex = this.#database[table]?.findIndex((row) => row.id === id);

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1);
            await this.#persist();
        }
    }
}