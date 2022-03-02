export function validateGameSchema(schema) {
  return (req, res, next) => {
    const validation = schema.validate(req.body);
    console.log(req.body);

    if (validation.error) {
      res.sendStatus(400);
      return;
    }
    next();
  };
}
