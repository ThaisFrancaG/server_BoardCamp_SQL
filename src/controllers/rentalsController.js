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

    if (customerId) {
      const rentalsCustomerFilter = await connection.query(
        `SELECT rentals.*,
       customers.id as "customerId", customers.name as "customerName",
       games.id as "gameId", games.name as "gameName",
       categories.id as "categorieId", categories.name as "categoriesName"
      FROM rentals 
      JOIN customers ON rentals."customerId"=customers.id AND "customerId"=$1
      JOIN games ON rentals."gameId"=games.id AND "customerId"=$1
      JOIN categories ON games."categoryId"=categories.id AND "customerId"=$1
     `,
        [customerId]
      );
      const rentalsListCustomer = rentalsCustomerFilter.rows.map((row) => {
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
      return res.status(200).send(rentalsListCustomer);
    }

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
      const rentalsListGame = rentalsGameFilter.rows.map((row) => {
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

      return res.status(200).send(rentalsListGame);
    }
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

    res.status(200).send(rentalsList);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function endRental(req, res) {
  try {
    const { id } = req.params;
    const returnedDate = dayjs().format("YYYY-MM-DD");

    const rentalDetails = await connection.query(
      `SELECT "rentDate","daysRented", "gameId", "returnDate" FROM rentals WHERE id=$1`,
      [id]
    );
    if (rentalDetails.rows.length === 0) {
      return res.status(404).send("Aluguel não encontrado");
    }

    const { rentDate, daysRented, gameId, returnDate } = rentalDetails.rows[0];

    if (returnDate !== null) {
      return res.sendStatus(400);
    }

    const expectedReturn = dayjs(rentDate)
      .add(parseInt(daysRented), "d")
      .format("YYYY-MM-DD");

    const differenceRentReturn = dayjs(returnedDate).diff(
      dayjs(expectedReturn),
      "day"
    );
    if (differenceRentReturn < 0) {
      const pricePerDay = await connection.query(
        `SELECT "pricePerDay" FROM games WHERE id=$1`,
        [gameId]
      );
      console.log(pricePerDay.rows);

      const delayFee = Math.abs(
        pricePerDay.rows[0].pricePerDay * differenceRentReturn
      );

      console.log(typeof delayFee);
      console.log(returnedDate);

      await connection.query(`UPDATE rentals set "returnDate"=$1 WHERE id=$2`, [
        returnedDate,
        id,
      ]);
      return res.status(200).send("aluguel finalizado");
    }

    await connection.query(`UPDATE rentals set "returnDate"=$1, WHERE id=$2`, [
      returnedDate,
      id,
    ]);

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function deleteRental(req, res) {
  try {
    const { id } = req.params;
    const rentalDetails = await connection.query(
      `SELECT "returnDate" FROM rentals WHERE id=$1`,
      [id]
    );
    if (rentalDetails.rows.length === 0) {
      return res.sendStatus(404);
    }

    if (rentalDetails.rows[0].returnDate === null) {
      return res.sendStatus(400);
    }
    await connection.query(`DELETE from rentals WHERE id=$1`, [id]);

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
