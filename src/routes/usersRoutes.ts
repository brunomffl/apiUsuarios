import { Router } from "express";
import { UsersControllers } from "../controllers/usersControllers.js";
import { verificarEmail } from "../middlewares/verifyEmail.js";
//importar o middleware aqui

const usersRoutes = Router();
const usersController = new UsersControllers();

usersRoutes.get("/", usersController.index);

usersRoutes.post("/", verificarEmail, usersController.create);

usersRoutes.delete("/:id", usersController.remove);

usersRoutes.put("/:id", verificarEmail, usersController.update)

export { usersRoutes }