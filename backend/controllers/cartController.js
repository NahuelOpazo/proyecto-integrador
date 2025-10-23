import { CartModel } from "../models/cartModel.js";

export const CartController = {
  async getCart(req, res, next) {
    try {
      const userId = req.user.id;
      const cart = await CartModel.getCartByUser(userId);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  },

  async addToCart(req, res, next) {
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;

      if (!productId || !quantity)
        return res.status(400).json({ message: "Faltan datos" });

      const result = await CartModel.addToCart(userId, productId, quantity);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async updateQuantity(req, res, next) {
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;

      await CartModel.updateQuantity(userId, productId, quantity);
      res.json({ message: "Cantidad actualizada" });
    } catch (error) {
      next(error);
    }
  },

  async removeFromCart(req, res, next) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;

      await CartModel.removeFromCart(userId, productId);
      res.json({ message: "Producto eliminado del carrito" });
    } catch (error) {
      next(error);
    }
  },
};
