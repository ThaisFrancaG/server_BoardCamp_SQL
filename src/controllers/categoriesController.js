import connection from "../database.js";

export async function getCategories(req, res) {
  try {
    const categories = await connection.query("SELECT * FROM categories;");
    res.status(200).send(categories.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function postCategories(req, res) {
  try {
    const newCategorie = req.body;

    let checkRepetitionName = await connection.query(
      `SELECT id FROM categories WHERE name=$1`,
      [newCategorie.name]
    );

    if (checkRepetitionName.rows.length > 0) {
      return res.sendStatus(409);
    }

    await connection.query(`INSERT INTO categories (name) VALUES ($1) `, [
      newCategorie.name,
    ]);

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
