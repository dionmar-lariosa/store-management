import { Request, Response, NextFunction } from "express";
import CustomerPaymentService from "../services/customerPaymentService.js";

const CustomerPaymentController = {
  addCustomerPayment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await CustomerPaymentService.addCustomerPayment(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }
};

export default CustomerPaymentController;
