import { pool } from "../database/pool.js";
import CategorySql from "../database/sql/categorySql.js";
import { CategoryRequestBody } from "../interface.js";
import EnsureUtil from "../utils/ensureUtil.js";

const CategoryService = {
  getCategories: async () => {
    const client = await pool.connect();

    try {
      const result = await client.query(CategorySql.selectAll);
      return result.rows;
    } finally {
      client.release();
    }
  },

  bulkCreateCategory: async (categories: CategoryRequestBody[]) => {
    const client = await pool.connect();
    const values: string[] = [];
    const placeholders = categories.map((category, index) => {
      values.push(category.name);
      return `($${index + 1})`;
    });

    try {
      const result = await client.query(CategorySql.bulkInsert(placeholders, values));
      return result.rows;
    } finally {
      client.release();
    }
  },

  updateCategory: async (id: number, category: CategoryRequestBody) => {
    const client = await pool.connect();

    try {
      const result = await client.query(CategorySql.update(id, category));

      EnsureUtil.ensureFound(result.rowCount, "Category", id);

      return result.rows[0];
    } finally {
      client.release();
    }
  },

  deleteCategory: async (id: number) => {
    const client = await pool.connect();

    try {
      const result = await client.query(CategorySql.delete(id));

      EnsureUtil.ensureFound(result.rowCount, "Category", id);
      return result.rowCount;
    } finally {
      client.release();
    }
  }
};

export default CategoryService;
