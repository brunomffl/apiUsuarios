import fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

import path from 'node:path';

const DATABASE_PATH = path.resolve(__dirname, '../data/db.json');

type DatabaseTable = Record<string, any>;
type Filters = Record<string, string>;

export class Database {
    #database: Record<string, DatabaseTable[]> = {};

    constructor() {
        fs.readFile(DATABASE_PATH, 'utf8')
            .then((data) => {
                this.#database = JSON.parse(data);
            })
            .catch(() => {
                this.#persist();
            });
    }

    #persist() {
        fs.writeFile(DATABASE_PATH, JSON.stringify(this.#database, null, 2)).catch((err) => {
            console.error('Erro ao persistir o banco de dados:', err);
        });
    }

    insert(table: string, data: DatabaseTable) {
        const newData = { id: randomUUID(), ...data };

        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(newData);
        } else {
            this.#database[table] = [newData];
        }

        this.#persist();
        return newData;
    }

    select(table: string, filters?: Filters) {
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

    update(table: string, id: string, data: Partial<DatabaseTable>) {
        const rowIndex = this.#database[table]?.findIndex((row) => row.id === id);

        if (rowIndex > -1) {
            this.#database[table][rowIndex] = {
                ...this.#database[table][rowIndex],
                ...data
            };
            this.#persist();
        }
    }

    delete(table: string, id: string) {
        const rowIndex = this.#database[table]?.findIndex((row) => row.id === id);

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1);
            this.#persist();
        }
    }
}