import { Router } from "express";
import { postRental } from "../controllers/rentalsController.js";
import { validateRentalsSchema } from "../middleware/rentalsValidation.js";
import rentalsSchema from "../schemas/rentalsSchema.js";

const rentalsRouter = Router();

rentalsRouter.post(
  "/rentals",
  validateRentalsSchema(rentalsSchema),
  postRental
);

export default rentalsRouter;
