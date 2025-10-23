import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);

// 🔹 Ruta de prueba
app.get("/api/health", async (req, res) => {
  const { rows } = await pool.query("SELECT NOW()");
  res.json({ status: "OK", time: rows[0].now });
});

// 🔹 Middleware de errores
app.use(errorHandler);

app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => console.log(`✅ Backend corriendo en http://localhost:${PORT}`));

