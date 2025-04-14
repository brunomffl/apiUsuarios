import { Request, Response } from "express";
import { z } from "zod";
import { Database } from "../database/database";

const database = new Database();

export class UsersControllers{
    index(req: Request, res: Response){
        const users = database.select('users');

        res.json(users);
    }

    create(req: Request, res: Response){
        const bodySchema = z.object({
            nomeCompleto: z.string({ required_error: "É necessário informar o nome completo do usuário" })
            .trim().min(5),
            email: z.string({ required_error: "É necessário informar o e-mail do usuário" }).email(),
            username: z.string({ required_error: "É necessário informar o nome de usuário" }).trim().min(4),
            dataCriacao: z.date({ required_error: "É necessário informar a data de criação deste perfil" })
        });

        try{
            const { nomeCompleto, email, username, dataCriacao } = bodySchema.parse(req.body);
            const novoUsuario = database.insert('usuarios', { nomeCompleto, email, username, dataCriacao });
            res.status(201).json(novoUsuario);
        } catch(error) {
            if(error instanceof z.ZodError){
                return res.status(400).json({ erros: error.errors })
            }
        }

    }
}