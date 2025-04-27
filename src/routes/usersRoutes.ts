import { Router } from "express";
import { UsersControllers } from "../controllers/usersControllers.js";
//importar o middleware aqui

const usersRoutes = Router();
const usersController = new UsersControllers();

usersRoutes.get("/", usersController.index);

usersRoutes.post("/", usersController.create);

usersRoutes.delete("/:id", usersController.remove);

usersRoutes.put("/:id", usersController.update)

export { usersRoutes }