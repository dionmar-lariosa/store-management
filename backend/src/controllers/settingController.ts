import { NextFunction, Request, Response } from "express";
import SettingService from "../services/settingService.js";

const SettingController = {
  authenticate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await SettingService.authenticate(req.body.pin);

      return res.status(200).json({
        access_token: token
      });
    } catch (err) {
      next(err);
    }
  },

  getSettings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await SettingService.getSettings();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },

  updateSetting: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await SettingService.updateSetting(req.body);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
};

export default SettingController;
