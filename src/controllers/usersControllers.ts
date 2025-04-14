import { Request, Response } from "express";
import { string, z } from "zod";
import { Database } from "../database/database";
import { randomUUID } from "crypto";

const database = new Database();

export class UsersControllers{
    index(req: Request, res: Response){
        const usuarios = database.select('usuarios');

        return res.json(usuarios);
    }

    create(req: Request, res: Response){
        const bodySchema = z.object({
            id: z.string().default(() => randomUUID()),
            nomeCompleto: z.string({ required_error: "É necessário informar o nome completo do usuário" })
            .trim().min(5),
            email: z.string({ required_error: "É necessário informar o e-mail do usuário" }).email(),
            username: z.string({ required_error: "É necessário informar o nome de usuário" }).trim().min(4),
            dataCriacao: z.coerce.date().default(() => new Date()).optional()
        });

        try{
            const { nomeCompleto, email, username, dataCriacao } = bodySchema.parse(req.body);
            const novoUsuario = database.insert('usuarios', { nomeCompleto, email, username, dataCriacao });
            return res.status(201).json(novoUsuario);
        } catch(error) {
            if(error instanceof z.ZodError){
                return res.status(400).json({ erros: error.errors })
            }
        }

        return res.status(500).json({ erro: 'Erro inesperado' });

    }
}