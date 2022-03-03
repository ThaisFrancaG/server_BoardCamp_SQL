import connection from "../database.js";

export async function postGame(req, res) {
  try {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    const checkName = await connection.query(
      `SELECT name FROM games WHERE name=$1`,
      [name]
    );
    if (checkName.rows.length > 0) {
      return res.status(409).send("Nome já em uso");
    }
    const checkCategorie = await connection.query(
      `SELECT id FROM categories WHERE id=$1`,
      [categoryId]
    );
    if (checkCategorie.rows.length === 0) {
      return res.status(400).send("Categoria não existe");
    }

    //aqui, parte do pressuposto de que passou em todos os testes
    let gameArray = [name, image, stockTotal, categoryId, pricePerDay];

    if (!image) {
      const imageAlt = "http://imagemPadrao";
      gameArray = [name, imageAlt, stockTotal, categoryId, pricePerDay];
    }
    await connection.query(
      `INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay") VALUES ($1,$2,$3,$4,$5)`,
      gameArray
    );

    res.status(201).send("Tá ok");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
