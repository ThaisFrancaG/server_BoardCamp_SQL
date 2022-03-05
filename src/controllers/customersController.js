import connection from "../database.js";

export async function postCustomer(req, res) {
  try {
    const { name, phone, cpf, birthday } = req.body;

    const checkCPFRepetition = await connection.query(
      `SELECT * FROM customers WHERE cpf = $1`,
      [cpf]
    );

    if (checkCPFRepetition.rows.length > 0) {
      return res.status(409).send("CPF já cadastrado");
    }

    await connection.query(
      `INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1,$2,$3,$4)`,
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
