import { Router } from "express";
import SaleController from "../controllers/saleController.js";

const router = Router();

router.get("/", SaleController.getSales);
router.post("/", SaleController.createSale);
router.get("/:id", SaleController.getSale);
router.patch("/:id", SaleController.voidSale);

export default router;
