export function validateRentalsSchema(schema) {
  return (req, res, next) => {
    const { customerId, gameId, daysRented } = req.body;
    const validation = schema.validate(req.body);
    if (validation.error) {
      res.sendStatus(400);
      return;
    }
    if (daysRented <= 0 || customerId < 0 || gameId < 0) {
      return res.sendStatus(400);
    }
    next();
  };
}
