import { Router } from "express";
import CustomerPaymentController from "../controllers/customerPaymentController.js";

const router = Router();

router.post("/", CustomerPaymentController.addCustomerPayment);

export default router;
