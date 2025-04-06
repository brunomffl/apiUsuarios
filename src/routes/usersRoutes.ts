import { Router } from "express";
//importar o middleware aqui
//importar os controllers (create, update...) das rotas

const usersRoutes = Router();
//instanciar o controlador -> const usersController = new UsersController();

usersRoutes.get("/", /*middleware, usersController.index*/);
usersRoutes.post("/", /*middleware, usersController.index*/);
usersRoutes.put("/", /*middleware, usersController.index*/);
usersRoutes.delete("/", /*middleware, usersController.index*/);

export { usersRoutes }