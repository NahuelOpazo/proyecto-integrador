import { pool } from "../config/db.js";

export const ProductModel = {
  async getAll({ search, category, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    let query = "SELECT * FROM products";
    let params = [];

    if (search || category) {
      const conditions = [];
      if (search) {
        conditions.push(`LOWER(title) LIKE LOWER($${params.length + 1})`);
        params.push(`%${search}%`);
      }
      if (category) {
        conditions.push(`LOWER(category) = LOWER($${params.length + 1})`);
        params.push(category);
      }
      query += " WHERE " + conditions.join(" AND ");
    }

    query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    const result = await pool.query(query, params);
    return result.rows;
  },

  async createProduct(data) {
    const { title, author, description, image_url, price, stock, category } = data;
    const result = await pool.query(
      `INSERT INTO products (title, author, description, image_url, price, stock, category)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [title, author, description, image_url, price, stock, category]
    );
    return result.rows[0];
  },

  async updateProduct(id, data) {
    const { title, author, description, image_url, price, stock, category } = data;
    const result = await pool.query(
      `UPDATE products SET title=$1, author=$2, description=$3, image_url=$4,
       price=$5, stock=$6, category=$7 WHERE id=$8 RETURNING *`,
      [title, author, description, image_url, price, stock, category, id]
    );
    return result.rows[0];
  },

  async deleteProduct(id) {
    await pool.query("DELETE FROM products WHERE id=$1", [id]);
  },
};
