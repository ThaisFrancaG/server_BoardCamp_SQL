import connection from "../database.js";

export async function postCustomer(req, res) {
  try {
    res.status(201).send("Foi criado");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
