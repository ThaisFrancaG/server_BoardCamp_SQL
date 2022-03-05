import { Router } from "express";
import {
  getCustomers,
  getOneCustomer,
  postCustomer,
} from "../controllers/customersController.js";
import { validateCustomerSchema } from "../middleware/customerValidation.js";
import customerSchema from "../schemas/customersSchema.js";

const customerRouter = Router();

customerRouter.post(
  "/customers",
  validateCustomerSchema(customerSchema),
  postCustomer
);

customerRouter.get("/customers", getCustomers);

customerRouter.get("/customers/:id", getOneCustomer);

export default customerRouter;
