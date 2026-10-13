import CustomerDebtService from "../services/customerDebtService.js";
import { Request, Response, NextFunction } from "express";

const CustomerDebtController = {
  getCustomerDebts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await CustomerDebtService.getCustomerDebts(req.query);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  bulkAddCustomerDebt: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await CustomerDebtService.bulkAddCustomerDebt(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }
};

export default CustomerDebtController;
