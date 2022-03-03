import { Router } from "express";
import {
  getCategories,
  postCategories,
} from "../controllers/categoriesController.js";
import { validateCategorieSchema } from "../middleware/generalValidation.js";
import categorieSchema from "../schemas/categoriesSchema.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);

categoriesRouter.post(
  "/categories",
  validateCategorieSchema(categorieSchema),
  postCategories
);

export default categoriesRouter;
