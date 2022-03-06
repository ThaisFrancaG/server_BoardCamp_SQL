import connection from "../database.js";

export async function postRental(req, res) {
  try {
    const { customerId, gameId, daysRented } = req.body;
    //tem que adicionar coisas no body antes de enviar pra db. Suponho que é aqui que entram os joins
    //COMEÇAR A CRIAR O OBJETO FINAL

    const rentDate = Date();

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
    //verificar se numero de dias é maior do que 0
    //verificar se tem o jogo disponivel

    console.log(rentDate);
    console.log("Conferencias da database");
    console.log(checkGameStock.rows[0].stockTotal);

    res.status(201).send("aluguel criado");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
