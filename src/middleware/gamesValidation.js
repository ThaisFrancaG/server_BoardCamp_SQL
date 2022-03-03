export function validateGameSchema(schema) {
  return (req, res, next) => {
    const validation = schema.validate(req.body);
    console.log(req.body);

    if (validation.error) {
      return res.sendStatus(400);
    }
    const stockTotal = parseInt(req.body.stockTotal);
    const pricePerDay = parseInt(req.body.pricePerDay);
    if (stockTotal !== stockTotal || pricePerDay !== pricePerDay) {
      return res.sendStatus(400);
    }
    if (stockTotal <= 0 || pricePerDay <= 0) {
      return res.status(400).send("Estoque e preço devem ser maiores do que 0");
    }

    next();
  };
}
