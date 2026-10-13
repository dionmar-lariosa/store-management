import Constant from "../constants.js";
import { pool } from "../database/pool.js";
import ProductSql from "../database/sql/productSql.js";
import SaleSql from "../database/sql/saleSql.js";
import { SaleQueryParams, SaleRequestBody } from "../interface.js";
import EnsureUtil from "../utils/ensureUtil.js";
import SaleUtil from "../utils/saleUtil.js";
import ProductService from "./productService.js";
import SettingService from "./settingService.js";

const SaleService = {
  getSales: async (params: SaleQueryParams) => {
    const client = await pool.connect();

    try {
      const result = await client.query(SaleSql.selectAll(params));
      return result.rows;
    } finally {
      client.release();
    }
  },

  getSale: async (id: number) => {
    const client = await pool.connect();

    try {
      const queries = SaleSql.select(id);
      const sale = await client.query(queries.sale);
      EnsureUtil.ensureFound(sale.rowCount, "Sale", id);

      const saleItems = await client.query(queries.saleItems);
      return {
        sale: sale.rows[0],
        sale_items: saleItems.rows
      };
    } finally {
      client.release();
    }
  },

  createSale: async (sale: SaleRequestBody) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Fetch all requested products
      const productIds = sale.sale_items.map((item) => item.product_id);
      const productResult = await client.query(ProductSql.selectByIds(productIds));
      const productMap = new Map(productResult.rows.map((product) => [product.id, product]));

      // Validate products, validate stock, calculate total
      const builtSale = SaleUtil.buildSale(sale.sale_items, productMap);

      // Create sale
      const saleResult = await client.query(SaleSql.insert(sale, builtSale.total));
      const createdSale = saleResult.rows[0];

      // Insert sale items
      const insertData = SaleUtil.buildBulkInsertData(
        createdSale.id,
        builtSale.saleItems,
        new Map(builtSale.saleItems.map((item) => [item.product_id, item.unit_price]))
      );
      await client.query(SaleSql.bulkInsert(insertData.placeholders, insertData.values));

      // Deduct stock
      await ProductService.deductStock(builtSale.saleItems);

      await client.query("COMMIT");

      return createdSale;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  voidSale: async (id: number, pin: string) => {
    const client = await pool.connect();
    await SettingService.verifyPin(pin);

    try {
      await client.query("BEGIN");

      // Fetch sale
      const queries = SaleSql.select(id);

      const saleResult = await client.query(queries.sale);
      EnsureUtil.ensureFound(saleResult.rowCount, "Sale", id);

      const sale = saleResult.rows[0];

      // Prevent voiding an already voided sale
      if (sale.status === Constant.STATUS_MESSAGES.SALES.STATUS.VOID) {
        throw new Error(Constant.ERROR_MESSAGES.SALES.VOID(id));
      }

      // Fetch sale items
      const saleItemsResult = await client.query(queries.saleItems);
      const stockMovements = saleItemsResult.rows.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity
      }));

      // Restore inventory
      await ProductService.restoreStock(stockMovements);

      // Mark sale as VOID
      const result = await client.query(SaleSql.updateToVoid(id));

      await client.query("COMMIT");

      return result.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
};

export default SaleService;
