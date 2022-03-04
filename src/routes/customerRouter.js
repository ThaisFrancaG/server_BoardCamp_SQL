import { Router } from "express";
import { postCustomer } from "../controllers/customersController.js";
import { validateCustomerSchema } from "../middleware/customerValidation.js";
import customerSchema from "../schemas/customersSchema.js";

const customerRouter = Router();

customerRouter.post(
  "/customers",
  validateCustomerSchema(customerSchema),
  postCustomer
);

export default customerRouter;
