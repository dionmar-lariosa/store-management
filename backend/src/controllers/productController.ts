import { Request, Response, NextFunction } from "express";
import ProductService from "../services/productService.js";
import { Order, ProductQueryParams } from "../interface.js";

const ProductController = {
  getProducts: async (req: Request, res: Response, next: NextFunction) => {
    const params: ProductQueryParams = {
      product: req.query.product as string | undefined,
      category: req.query.category as string | undefined,
      order: req.query.order as Order | undefined,
      is_active: req.query.is_active === undefined ? undefined : req.query.is_active === "true"
    };

    try {
      const data = await ProductService.getProducts(params);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  getProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await ProductService.getProduct(Number(req.params.id));
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  createProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await ProductService.createProduct(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  },

  updateProduct: async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const body = req.body;

    try {
      const data = await ProductService.updateProduct(id, body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  updateIsActive: async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const body = req.body;
    try {
      const data = await ProductService.updateIsActive(id, body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
};

export default ProductController;
