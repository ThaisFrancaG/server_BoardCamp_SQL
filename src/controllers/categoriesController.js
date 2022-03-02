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
    //conferir se já tem a categoria
    await connection.query(`INSERT INTO categories (name) VALUES ($1) `, [
      newCategorie.name,
    ]);
    console.log("CHEGOU AQUI");

    res.status(201).send("foi");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
