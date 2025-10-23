import { pool } from "../config/db.js";

export const OrderModel = {
  async createOrder(userId, items) {
    // Calcular el total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Crear el pedido
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, total_amount, status, created_at)
       VALUES ($1, $2, 'pendiente', NOW())
       RETURNING id`,
      [userId, total]
    );

    const orderId = orderResult.rows[0].id;

    // Insertar los productos del pedido
    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    return { orderId, total };
  },

  async getOrdersByUser(userId) {
    const result = await pool.query(
      `SELECT o.id AS order_id, o.total_amount, o.status, o.created_at,
              json_agg(json_build_object(
                'product_id', oi.product_id,
                'quantity', oi.quantity,
                'price', oi.price
              )) AS items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );

    return result.rows;
  },
};
