import { Router } from "express";
import {
  deleteRental,
  endRental,
  getRentals,
  postRental,
} from "../controllers/rentalsController.js";
import { validateRentalsSchema } from "../middleware/rentalsValidation.js";
import rentalsSchema from "../schemas/rentalsSchema.js";

const rentalsRouter = Router();

rentalsRouter.post(
  "/rentals",
  validateRentalsSchema(rentalsSchema),
  postRental
);

rentalsRouter.get("/rentals", getRentals);

rentalsRouter.post("/rentals/:id/return", endRental);

rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;
