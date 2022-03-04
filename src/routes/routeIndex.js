import { Router } from "express";
import categoriesRouter from "./categoriesRouter.js";
import customerRouter from "./customerRouter.js";
import gamesRouter from "./gamesRouter.js";

const router = Router();

router.use(categoriesRouter);
router.use(gamesRouter);
router.use(customerRouter);

export default router;
