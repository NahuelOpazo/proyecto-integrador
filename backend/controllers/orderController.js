import { CartModel } from "../models/cartModel.js";
import { OrderModel } from "../models/orderModel.js";

export const OrderController = {
  async createOrder(req, res, next) {
    try {
      const userId = req.user.id;

      // Obtener el carrito del usuario
      const cartItems = await CartModel.getCartByUser(userId);
      if (cartItems.length === 0)
        return res.status(400).json({ message: "El carrito está vacío" });

      // Crear el pedido
      const order = await OrderModel.createOrder(userId, cartItems);

      // Vaciar el carrito después de generar el pedido
      await CartModel.clearCart(userId);

      res.status(201).json({
        message: "Pedido creado con éxito",
        orderId: order.orderId,
        total: order.total,
      });
    } catch (error) {
      next(error);
    }
  },

  async getOrders(req, res, next) {
    try {
      const userId = req.user.id;
      const orders = await OrderModel.getOrdersByUser(userId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  },
};
