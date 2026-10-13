import { Request, Response, NextFunction } from "express";
import CategoryService from "../services/categoryService.js";
import DatabaseUtil from "../utils/databaseUtil.js";

const CategoryController = {
  getCategories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await CategoryService.getCategories();
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  bulkCreateCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await CategoryService.bulkCreateCategory(req.body);
      res.status(201).json(data);
    } catch (error) {
      DatabaseUtil.uniqueViolation(error);
      next(error);
    }
  },

  updateCategory: async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const body = req.body;

    try {
      const data = await CategoryService.updateCategory(id, body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  deleteCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await CategoryService.deleteCategory(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

export default CategoryController;
