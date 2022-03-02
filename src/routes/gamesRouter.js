import { Router } from "express";
import { postGame } from "../controllers/gamesController.js";
import { validateGameSchema } from "../middleware/gamesValidation.js";
import gamesSchema from "../schemas/gamesSchema.js";

const gamesRouter = Router();

gamesRouter.post("/games", validateGameSchema(gamesSchema), postGame);

export default gamesRouter;
