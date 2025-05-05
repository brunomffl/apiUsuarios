import { Request, Response, NextFunction } from "express";
import { Database } from "../database/database.js";

const database = new Database();

export async function verificarEmail(req: Request, res: Response, next: NextFunction){
    const { email } = req.body;

    if(!email){
        return next();
    };

    const usuarios = await database.select("usuarios");
    const usuarioId = req.params.id;


    const emailExiste = usuarios.some((usuario) => { //percorre todos os usuarios e verifica se existe algum com o que queremos usando o some.
        if(usuarioId && usuario.id === usuarioId){
            //verifica se estamos atualizando. Isso verifica a partir do parâmetro opcional na url, se tiver, quer dizer que estamos atualizando um usuário e pode ignorar a verificação.
            return false;
        }
        //aqui verifica em caso de adicionar um novo usuário, caso exista um email igual já cadastrado retorna true
        return usuario.email.toLowerCase().trim() === email.toLowerCase().trim();
    })

    if(emailExiste){
        return res.status(400).json({ message: "Este e-mail já está sendo utilizado por outro usuário!" })
    }

    return next();
}