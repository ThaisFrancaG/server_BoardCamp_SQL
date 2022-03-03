import { Router } from "express";
import { getGame, postGame } from "../controllers/gamesController.js";
import { validateGameSchema } from "../middleware/gamesValidation.js";
import gamesSchema from "../schemas/gamesSchema.js";

const gamesRouter = Router();

gamesRouter.post("/games", validateGameSchema(gamesSchema), postGame);

gamesRouter.get("/games", getGame);
export default gamesRouter;
