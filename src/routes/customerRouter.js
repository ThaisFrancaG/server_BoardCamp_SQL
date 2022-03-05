import { Router } from "express";
import {
  getCustomers,
  getOneCustomer,
  postCustomer,
  updateCustomer,
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

customerRouter.put(
  "/customers/:id",
  validateCustomerSchema(customerSchema),
  updateCustomer
);

export default customerRouter;
