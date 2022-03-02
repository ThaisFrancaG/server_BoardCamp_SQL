import connection from "../database.js";

export async function postGame(req, res) {
  try {
    res.status(201).send("Tá ok");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
