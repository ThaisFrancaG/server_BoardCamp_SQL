import joi from "joi";

const gamesSchema = joi.object({
  name: joi.string().required(),
  image: joi.string(),
  stockTotal: joi.string().required(),
  categoryId: joi.required(),
  pricePerDay: joi.string().required(),
});

export default gamesSchema;
