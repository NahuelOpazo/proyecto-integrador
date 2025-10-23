import { ProductModel } from "../models/productModel.js";

export const ProductController = {
  async getAll(req, res, next) {
    try {
      const { search, category, page } = req.query;
      const products = await ProductModel.getAll({ search, category, page });
      res.json(products);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const product = await ProductModel.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const product = await ProductModel.updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      await ProductModel.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
