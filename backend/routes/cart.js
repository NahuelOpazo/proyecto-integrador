import express from "express";
import { CartController } from "../controllers/cartController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, CartController.getCart);
router.post("/", verifyToken, CartController.addToCart);
router.put("/", verifyToken, CartController.updateQuantity);
router.delete("/:productId", verifyToken, CartController.removeFromCart);

export default router;
