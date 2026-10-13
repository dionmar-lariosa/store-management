import { NextFunction, Request, Response } from "express";
import SaleService from "../services/saleService.js";
import { Order, SaleQueryParams } from "../interface.js";

const SaleController = {
  getSales: async (req: Request, res: Response, next: NextFunction) => {
    const params: SaleQueryParams = {
      start_date: req.query.start_date as string | undefined,
      end_date: req.query.end_date as string | undefined,
      payment_method: req.query.payment_method as SaleQueryParams["payment_method"],
      status: req.query.status as SaleQueryParams["status"],
      order: req.query.order as Order | undefined
    };

    try {
      const data = await SaleService.getSales(params);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },

  getSale: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await SaleService.getSale(Number(req.params.id));
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },

  createSale: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await SaleService.createSale(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  },

  voidSale: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await SaleService.voidSale(Number(req.params.id), req.body.pin as string);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
};

export default SaleController;
