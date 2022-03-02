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
