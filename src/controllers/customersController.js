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

export async function getCustomers(req, res) {
  let customerCPF = req.query.cpf;
  try {
    if (customerCPF) {
      if (parseInt(customerCPF) !== parseInt(customerCPF)) {
        return res.sendStatus(400);
      }
      const customerFilter = await connection.query(
        `SELECT * FROM customers WHERE cpf LIKE $1`,
        [`${customerCPF}%`]
      );

      if (customerFilter.rows.length === 0) {
        return res.status(404).send("Usuário não enontrado");
      }
      return res.status(200).send(customerFilter.rows);
    }

    const customers = await connection.query(`SELECT * FROM customers`);

    if (customers.rows.length === 0) {
      return res.status(200).send("Não há clientes cadastrados");
    }
    res.status(200).send(customers.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getOneCustomer(req, res) {
  const { id } = req.params;
  try {
    console.log(id);

    const customer = await connection.query(
      `SELECT * FROM customers WHERE id = $1`,
      [id]
    );
    console.log(customer.rows);

    if (customer.rows.length === 0) {
      return res.status(404).send("Usuário não encontrado");
    }
    res.status(200).send(customer.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
