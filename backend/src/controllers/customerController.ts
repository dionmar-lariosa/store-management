import CustomerService from "../services/customerService.js";
import { Request, Response, NextFunction } from "express";

const CustomerController = {
  getCustomers: async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.query.customer as string | undefined;

    try {
      const data = await CustomerService.getCustomers(customer);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  getCustomer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await CustomerService.getCustomer(Number(req.params.id));
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  createCustomer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await CustomerService.createCustomer(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  },

  updateCustomer: async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const body = req.body;

    try {
      const data = await CustomerService.updateCustomer(id, body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  deleteCustomer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await CustomerService.deleteCustomer(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

export default CustomerController;
