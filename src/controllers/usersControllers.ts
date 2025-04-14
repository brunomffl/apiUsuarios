import { Request, Response } from "express";
import { z } from "zod";

export class UsersControllers{
    index(req: Request, res: Response){
        res.send('Teste do index aqui dos controladores!');
    }
}