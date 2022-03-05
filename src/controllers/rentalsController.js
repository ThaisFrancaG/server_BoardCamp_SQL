import connection from "../database.js";

export function postRental(req, res) {
  try {
    //tem que adicionar coisas no body antes de enviar pra db. Suponho que é aqui que entram os joins
    res.status(201).send("aluguel criado");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
