import { Router } from "express";
import CategoryController from "../controllers/categoryController.js";

const router = Router();

router.get("/", CategoryController.getCategories);
router.post("/", CategoryController.bulkCreateCategory);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

export default router;
