import { Router } from "express";
import categoryRoute from "./categoryRoute.js";
import productRoute from "./productRoute.js";
import customerRoute from "./customerRoute.js";
import customerDebtRoute from "./customerDebtRoute.js";
import customerPaymentRoute from "./customerPaymentRoute.js";
import saleRoute from "./saleRoute.js";
import settingRoute from "./settingRoute.js";

const router = Router();

router.use("/categories", categoryRoute);
router.use("/products", productRoute);
router.use("/customers", customerRoute);
router.use("/customer-debts", customerDebtRoute);
router.use("/customer-payments", customerPaymentRoute);
router.use("/sales", saleRoute);
router.use("/settings", settingRoute);

export default router;
