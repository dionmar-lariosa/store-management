import { Router } from "express";
import CustomerController from "../controllers/customerController.js";

const router = Router();

router.get("/", CustomerController.getCustomers);
router.get("/:id", CustomerController.getCustomer);
router.post("/", CustomerController.createCustomer);
router.put("/:id", CustomerController.updateCustomer);
router.delete("/:id", CustomerController.deleteCustomer);

export default router;
