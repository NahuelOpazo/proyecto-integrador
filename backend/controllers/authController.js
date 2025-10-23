import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const AuthController = {
  // Registro de usuario
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
      }

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) return res.status(400).json({ message: "El usuario ya existe" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.createUser(name, email, hashedPassword);

      res.status(201).json({ message: "Usuario registrado con éxito", user });
    } catch (error) {
      next(error);
    }
  },

  // Inicio de sesión
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findByEmail(email);

      if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(401).json({ message: "Contraseña incorrecta" });

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "2h" });

      res.status(200).json({
        message: "Inicio de sesión exitoso",
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error) {
      next(error);
    }
  },
};

export const registerUser = (req, res) => {
  console.log("📩 Datos recibidos en register:", req.body);
  res.status(201).json({ message: "Usuario registrado correctamente (dummy)" });
};

export const loginUser = (req, res) => {
  console.log("🔑 Datos recibidos en login:", req.body);
  res.status(200).json({ token: "token-falso-de-prueba" });
};
