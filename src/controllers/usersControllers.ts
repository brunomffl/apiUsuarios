import { Request, Response } from "express";
import { z } from "zod";
import { Database } from "../database/database.js";
import { randomUUID } from "crypto";

const database = new Database();

export class UsersControllers{
    index = async (req: Request, res: Response) => {
        const usuarios = await database.select('usuarios');
        return res.json(usuarios);
    }

    create = async (req: Request, res: Response) => {
        const bodySchema = z.object({
            nomeCompleto: z.string({ required_error: "É necessário informar o nome completo do usuário" })
            .trim().min(5),
            email: z.string({ required_error: "É necessário informar o e-mail do usuário" }).email(),
            username: z.string({ required_error: "É necessário informar o nome de usuário" }).trim().min(4),
            dataCriacao: z.coerce.date().default(() => new Date()).optional()
        });

        try{
            const { nomeCompleto, email, username, dataCriacao } = bodySchema.parse(req.body);
            const novoUsuario = await database.insert('usuarios', { nomeCompleto, email, username, dataCriacao });
            return res.status(201).json(novoUsuario);
        } catch(error) {
            if(error instanceof z.ZodError){
                return res.status(400).json({ erros: error.errors })
            }
            return res.status(500).json({ erro: 'Erro inesperado' });
        }
    }

    remove = async (req: Request, res: Response) => {
        const { id } = req.params;

        const usuarios = await database.select("usuarios");
        const usuarioExiste = usuarios.some((usuario) => {
            return usuario.id === id;
        });

        if(!usuarioExiste){
            return res.status(404).json({ erro: `Usuário com id: ${id} não foi encontrado` });
        }
        await database.delete("usuarios", id);
        return res.status(204).json();
    }

    update = async (req: Request, res: Response) => {
        const { id } = req.params;

        const usuarios = await database.select("usuarios");
        const usuarioExiste = usuarios.some((usuario) => {
            return usuario.id === id;
        });

        if(!usuarioExiste){
            return res.status(404).json({ erro: `Usuário com id: ${id} não foi encontrado` });
        };

        const bodySchema = z.object({
            nomeCompleto: z.string().trim().min(5).optional(),
            email: z.string().email().optional(),
            username: z.string().trim().min(4).optional()
        });

        try {
            const novosDados = bodySchema.parse(req.body);
            await database.update("usuarios", id, novosDados);

            const usuariosAtualizados = await database.select("usuarios");
            const usuarioAtualizado = usuariosAtualizados.find((user) => {
                return user.id === id;
            });
            
            return res.json(usuarioAtualizado);
        } catch(error) {
            if(error instanceof z.ZodError){
                return res.status(400).json({ erros: error.errors })
            }

            return res.status(500).json({ erro: "Erro inesperado, aguarde e tente novamente!" });
        }
    }
}