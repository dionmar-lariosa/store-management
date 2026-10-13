import { Router } from "express";
import CustomerDebtController from "../controllers/customerDebtController.js";

const router = Router();

router.get("/", CustomerDebtController.getCustomerDebts);
router.post("/", CustomerDebtController.bulkAddCustomerDebt);

export default router;
