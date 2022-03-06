import { Router } from "express";
import { getRentals, postRental } from "../controllers/rentalsController.js";
import { validateRentalsSchema } from "../middleware/rentalsValidation.js";
import rentalsSchema from "../schemas/rentalsSchema.js";

const rentalsRouter = Router();

rentalsRouter.post(
  "/rentals",
  validateRentalsSchema(rentalsSchema),
  postRental
);

rentalsRouter.get("/rentals", getRentals);

export default rentalsRouter;
