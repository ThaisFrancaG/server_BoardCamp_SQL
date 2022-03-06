import connection from "../database.js";
import dayjs from "dayjs";

export async function postRental(req, res) {
  try {
    const { customerId, gameId, daysRented } = req.body;

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

    console.log("Conferencias da database");

    const rentDate = dayjs().format("YYYY-MM-DD");
    const returnDate = null;
    const delayFee = null;

    const pricePerDay = await connection.query(
      `SELECT "pricePerDay" FROM games WHERE id = $1`,
      [gameId]
    );

    const originalPrice = pricePerDay.rows[0].pricePerDay * daysRented;

    const rentalArray = [
      customerId,
      gameId,
      rentDate,
      daysRented,
      returnDate,
      originalPrice,
      delayFee,
    ];

    await connection.query(
      `INSERT INTO rentals ("customerId",
      "gameId",
      "rentDate",
      "daysRented",
      "returnDate",
      "originalPrice",
      "delayFee") VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      rentalArray
    );

    await connection.query(
      `UPDATE games SET "stockTotal" = "stockTotal"-1 WHERE id=$1`,
      [gameId]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
