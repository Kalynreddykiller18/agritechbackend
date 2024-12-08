import connection from "../config/sqldb.js";

const getOrders = async (req, res, next) => {
  try {
    const [orders] = await connection.query("select * from orders");
    res.status(200).json(orders);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

const getOrderByID = async (req, res, next) => {
  try {
    const [order] = await connection.query(
      "SELECT * FROM orders WHERE order_id = ?",
      [parseInt(req.params.id)]
    );
    if (order.length == 0)
      return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message);
  }
};

const getOrdersbyCustomerId = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [order] = await connection.query(
      "SELECT * FROM orders WHERE customer_id = ?",
      [id]
    );

    if (order.length == 0)
      return res
        .status(404)
        .json({ message: `Orders not found for user with user id: ${id}` });

    res.status(200).json(order);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

const createOrder = async (req, res, next) => {
  try {
    const order = [
      req.body.product_id,
      req.body.customer_id,
      req.body.quantity,
      req.body.address,
      req.body.status,
      req.body.payment_id,
    ];
    const ord = await connection.query(
      "INSERT INTO orders (product_id,customer_id,quantity,address,status,payment_id) values (?,?,?,?,?,?)",
      order
    );
    console.log(ord.length);
    res.status(201).json({ message: "Order created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message);
  }
};

const updateOrderById = async (req, res, next) => {
  const { body } = req;
  const orderId = req.params.id;
  try {
    const update = Object.keys(body)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = Object.values(body);

    values.push(orderId);
    const query = `UPDATE orders SET ${update} WHERE order_id = ?`;

    // Execute the query
    const [result] = await connection.query(query, values);

    res.json({ message: "Order updated successfully", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const deleteuser = await connection.query(
      "DELETE FROM orders where order_id = ?",
      [id]
    );
    if (deleteuser[0].affectedRows == 0)
      return res.status(404).json({ message: "User not found" });

    console.log(deleteuser);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

const order = {
  getOrders,
  getOrderByID,
  createOrder,
  updateOrderById,
  deleteOrder,
  getOrdersbyCustomerId,
};

export default order;
