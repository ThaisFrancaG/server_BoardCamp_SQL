export function validateCustomerSchema(schema) {
  return (req, res, next) => {
    console.log(req.body);
    const { name, phone, cpf, birthday } = req.body;

    const validation = schema.validate(req.body);
    if (validation.error) {
      return res.sendStatus(400);
    }
    next();
  };
}
