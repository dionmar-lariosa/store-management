import { Router } from "express";
import ProductController from "../controllers/productController.js";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/:id", ProductController.getProduct);
router.post("/", ProductController.createProduct);
router.put("/:id", ProductController.updateProduct);
router.patch("/:id", ProductController.updateIsActive);

export default router;
