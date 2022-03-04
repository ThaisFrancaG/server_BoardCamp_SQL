export function validateCustomerSchema(schema) {
  return (req, res, next) => {
    console.log(req.body);
    const { name, phone, cpf, birthday } = req.body;
    console.log(typeof name);
    console.log(typeof phone);
    console.log(typeof cpf);
    console.log(typeof birthday);

    const validation = schema.validate(req.body);
    if (validation.error) {
      console.log("deu erro genérico");
      return res.sendStatus(400);
    }
    next();
  };
}
