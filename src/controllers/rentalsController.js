import connection from "../database.js";
import dayjs from "dayjs";

export async function postRental(req, res) {
  try {
    const { customerId, gameId, daysRented } = req.body;

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

export async function getRentals(req, res) {
  try {
    const { customerId, gameId } = req.query;

    const rentalsBase = await connection.query(
      `SELECT rentals.*,
       customers.id as "customerId", customers.name as "customerName",
       games.id as "gameId", games.name as "gameName",
       categories.id as "categorieId", categories.name as "categoriesName"
      FROM rentals 
      JOIN customers ON rentals."customerId"=customers.id
      JOIN games ON rentals."gameId"=games.id
      JOIN categories ON games."categoryId"=categories.id
     `
    );

    const rentalsList = rentalsBase.rows.map((row) => {
      const {
        id,
        customerId,
        gameId,
        rentDate,
        daysRented,
        originalPrice,
        delayFee,
        customerName,
        gameName,
        categorieId,
        categoriesName,
      } = row;
      const rentalsDetails = {
        id: id,
        customerId: customerId,
        gameId: gameId,
        rentDate: rentDate,
        daysRented: daysRented,
        originalPrice: originalPrice,
        delayFee: delayFee,
        customer: { id: customerId, name: customerName },
        game: {
          id: gameId,
          name: gameName,
          categoryId: categorieId,
          categoryName: categoriesName,
        },
      };
      return rentalsDetails;
    });

    // console.log(rentalsList);
    if (customerId) {
      console.log("ai tem que procurar os rentals da pessoa");
    }

    console.log("chegou aqui");
    if (gameId) {
      const rentalsGameFilter = await connection.query(
        `SELECT rentals.*,
       customers.id as "customerId", customers.name as "customerName",
       games.id as "gameId", games.name as "gameName",
       categories.id as "categorieId", categories.name as "categoriesName"
      FROM rentals 
      JOIN customers ON rentals."customerId"=customers.id AND "gameId"=$1
      JOIN games ON rentals."gameId"=games.id AND "gameId"=$1
      JOIN categories ON games."categoryId"=categories.id AND "gameId"=$1
      
     `,
        [gameId]
      );
      const rentalsListGame = rentalsBase.rows.map((row) => {
        const {
          id,
          customerId,
          gameId,
          rentDate,
          daysRented,
          originalPrice,
          delayFee,
          customerName,
          gameName,
          categorieId,
          categoriesName,
        } = row;
        const rentalsDetails = {
          id: id,
          customerId: customerId,
          gameId: gameId,
          rentDate: rentDate,
          daysRented: daysRented,
          originalPrice: originalPrice,
          delayFee: delayFee,
          customer: { id: customerId, name: customerName },
          game: {
            id: gameId,
            name: gameName,
            categoryId: categorieId,
            categoryName: categoriesName,
          },
        };
        return rentalsDetails;
      });
      console.log(rentalsGameFilter.rows);
      console.log(rentalsListGame);
    }

    res.status(200).send("Chegou no rentals");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
