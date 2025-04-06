import { Router } from "express";
//importar o middleware aqui
//importar os controllers (create, update...) das rotas

const usersRouter = Router();
//instanciar o controlador -> const usersController = new UsersController();

usersRouter.get("/", /*middleware, usersController.index*/);
usersRouter.post("/", /*middleware, usersController.index*/);
usersRouter.put("/", /*middleware, usersController.index*/);
usersRouter.delete("/", /*middleware, usersController.index*/);

export { usersRouter }