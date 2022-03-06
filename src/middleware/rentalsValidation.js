import connection from "../database.js";

export function validateRentalsSchema(schema) {
  return async (req, res, next) => {
    const { customerId, gameId, daysRented } = req.body;
    const validation = schema.validate(req.body);

    if (validation.error) {
      res.sendStatus(400);
      return;
    }
    if (daysRented <= 0 || customerId < 0 || gameId < 0) {
      return res.sendStatus(400);
    }

    const checkCustomer = await connection.query(
      `SELECT * FROM customers WHERE id = $1`,
      [customerId]
    );
    const checkGameId = await connection.query(
      `SELECT * FROM games WHERE id = $1`,
      [gameId]
    );

    if (checkCustomer.rows.length === 0 || checkGameId.rows.length === 0) {
      return res.sendStatus(400);
    }

    const checkGameStock = await connection.query(
      `SELECT "stockTotal" FROM games WHERE id = $1`,
      [gameId]
    );

    if (checkGameStock.rows[0].stockTotal <= 0) {
      return res.status(400).send("Não há estoque do jogo");
    }

    next();
  };
}
