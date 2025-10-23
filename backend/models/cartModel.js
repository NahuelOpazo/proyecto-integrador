import { pool } from "../config/db.js";

export const CartModel = {
  async getCartByUser(userId) {
    const result = await pool.query(
      `SELECT c.id AS cart_id, p.id AS product_id, p.title, p.price, p.image_url, c.quantity
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    );
    return result.rows;
  },

  async addToCart(userId, productId, quantity) {
    // Si el producto ya está en el carrito, actualizar la cantidad
    const existing = await pool.query(
      "SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );

    if (existing.rowCount > 0) {
      const newQuantity = existing.rows[0].quantity + quantity;
      await pool.query(
        "UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3",
        [newQuantity, userId, productId]
      );
      return { message: "Cantidad actualizada" };
    }

    // Si no está, agregar nuevo producto
    await pool.query(
      "INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)",
      [userId, productId, quantity]
    );

    return { message: "Producto agregado al carrito" };
  },

  async updateQuantity(userId, productId, quantity) {
    await pool.query(
      "UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3",
      [quantity, userId, productId]
    );
  },

  async removeFromCart(userId, productId) {
    await pool.query(
      "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );
  },

  async clearCart(userId) {
    await pool.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);
  },
};
