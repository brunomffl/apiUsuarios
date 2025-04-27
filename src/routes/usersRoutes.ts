import { Router } from "express";
import { UsersControllers } from "../controllers/usersControllers.js";
//importar o middleware aqui

const usersRoutes = Router();
const usersController = new UsersControllers();

usersRoutes.get("/", usersController.index);

usersRoutes.post("/", usersController.create);

usersRoutes.delete("/:id", usersController.remove)

//usersRoutes.post("/", /*middleware, usersController.index*/);

//usersRoutes.put("/", /*middleware, usersController.index*/);


export { usersRoutes }