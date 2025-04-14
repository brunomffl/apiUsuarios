import { Router } from "express";
import { UsersControllers } from "../controllers/usersControllers";
//importar o middleware aqui
//importar os controllers (create, update...) das rotas

const usersRoutes = Router();
const usersController = new UsersControllers();
//instanciar o controlador -> const usersController = new UsersController();

usersRoutes.get("/", usersController.index);

//usersRoutes.post("/", /*middleware, usersController.index*/);

//usersRoutes.put("/", /*middleware, usersController.index*/);

//usersRoutes.delete("/", /*middleware, usersController.index*/);

export { usersRoutes }