import express from "express";
import { OrderController } from "../controllers/orderController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, OrderController.createOrder);
router.get("/", verifyToken, OrderController.getOrders);

export default router;
