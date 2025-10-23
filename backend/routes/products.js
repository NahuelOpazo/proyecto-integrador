import express from "express";
import { ProductController } from "../controllers/productController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", ProductController.getAll);
router.post("/", verifyToken, ProductController.create);
router.put("/:id", verifyToken, ProductController.update);
router.delete("/:id", verifyToken, ProductController.remove);

export default router;
