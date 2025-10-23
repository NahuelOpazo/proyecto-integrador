import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Guarda los datos del usuario en la request
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
}
