import { pool } from "../database/pool.js";
import ProductSql from "../database/sql/productSql.js";
import { ProductQueryParams, ProductRequestBody, StockMovement } from "../interface.js";
import EnsureUtil from "../utils/ensureUtil.js";

const ProductService = {
  getProducts: async (params: ProductQueryParams) => {
    const client = await pool.connect();

    try {
      const result = await client.query(ProductSql.selectAll(params));
      return result.rows;
    } finally {
      client.release();
    }
  },

  getProduct: async (id: number) => {
    const client = await pool.connect();

    try {
      const result = await client.query(ProductSql.select(id));
      EnsureUtil.ensureFound(result.rowCount, "Product", id);

      return result.rows[0];
    } finally {
      client.release();
    }
  },

  createProduct: async (product: ProductRequestBody) => {
    const client = await pool.connect();

    try {
      const result = await client.query(ProductSql.insert(product));
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  updateProduct: async (id: number, product: ProductRequestBody) => {
    const client = await pool.connect();

    try {
      const result = await client.query(ProductSql.update(id, product));
      EnsureUtil.ensureFound(result.rowCount, "Product", id);

      return result.rows[0];
    } finally {
      client.release();
    }
  },

  updateIsActive: async (id: number, body: { is_active: boolean }) => {
    const client = await pool.connect();

    try {
      const result = await client.query(ProductSql.updateIsActive(id, body));
      EnsureUtil.ensureFound(result.rowCount, "Product", id);

      return result.rows[0];
    } finally {
      client.release();
    }
  },

  deductStock: async (items: StockMovement[]) => {
    const client = await pool.connect();
    const placeholders: string[] = [];
    const values: number[] = [];

    items.forEach((item, index) => {
      const offset = index * 2;

      // PostgreSQL cannot reliably infer parameter types inside a dynamic
      // VALUES table used by UPDATE ... FROM. Explicitly casting to int
      // prevents "operator does not exist: integer = text" errors.
      placeholders.push(`($${offset + 1}::int, $${offset + 2}::int)`);
      values.push(item.product_id, item.quantity);
    });

    await client.query(ProductSql.deductStock(placeholders, values));
  },

  restoreStock: async (items: StockMovement[]) => {
    const client = await pool.connect();
    const placeholders: string[] = [];
    const values: number[] = [];

    items.forEach((item, index) => {
      const offset = index * 2;

      // PostgreSQL cannot reliably infer parameter types inside a dynamic
      // VALUES table used by UPDATE ... FROM. Explicitly casting to int
      // prevents "operator does not exist: integer = text" errors.
      placeholders.push(`($${offset + 1}::int, $${offset + 2}::int)`);

      values.push(item.product_id, item.quantity);
    });

    await client.query(ProductSql.increaseStock(placeholders, values));
  }
};

export default ProductService;
