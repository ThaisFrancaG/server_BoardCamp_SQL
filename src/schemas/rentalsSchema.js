import joi from "joi";

const rentalsSchema = joi.object({
  customerId: joi.number().required(),
  gameId: joi.number().required(),
  daysRented: joi.number().required(),
});

export default rentalsSchema;
