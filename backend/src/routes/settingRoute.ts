import { Router } from "express";
import SettingController from "../controllers/settingController.js";
import JwtMiddleware from "../middleware/jwtMiddleware.js";

const router = Router();

router.post("/auth", SettingController.authenticate);
router.use(JwtMiddleware);

// Protected Routes
router.get("/", SettingController.getSettings);
router.patch("/", SettingController.updateSetting);

export default router;
