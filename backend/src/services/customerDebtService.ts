import { pool } from "../database/pool.js";
import CustomerDebtSql from "../database/sql/customerDebtSql.js";
import CustomerSql from "../database/sql/customerSql.js";
import ProductSql from "../database/sql/productSql.js";
import { CustomerDebtQueryParams, CustomerDebtRequestBody } from "../interface.js";
import CustomerDebtUtil from "../utils/customerDebtUtil.js";
import EnsureUtil from "../utils/ensureUtil.js";
import ProductService from "./productService.js";

export const CustomerDebtService = {
  getCustomerDebts: async (params: CustomerDebtQueryParams) => {
    const client = await pool.connect();
    const sortMap = {
      highest_debt: "total_debt DESC",
      lowest_debt: "total_debt ASC",
      highest_paid: "total_paid DESC",
      lowest_paid: "total_paid ASC",
      highest_balance: "remaining_balance DESC",
      lowest_balance: "remaining_balance ASC"
    } as const;
    const orderBy = sortMap[params.sort ?? "highest_debt"];

    try {
      const result = await client.query(
        CustomerDebtSql.getCustomerDebts({ customer: params.customer, orderBy })
      );
      return result.rows;
    } finally {
      client.release();
    }
  },

  bulkAddCustomerDebt: async (customerDebts: CustomerDebtRequestBody) => {
    const client = await pool.connect();
    const { customer_id, debts } = customerDebts;

    try {
      await client.query("BEGIN");

      const customer = await client.query(CustomerSql.selectProfile(customer_id).customer);
      EnsureUtil.ensureFound(customer.rowCount, "Customer", customer_id);

      const productIds = debts.map((debt) => debt.product_id);
      const products = await client.query(ProductSql.selectByIds(productIds));
      const productMap = new Map<number, string>(
        products.rows.map((product) => [product.id, product.selling_price])
      );

      const { placeholders, values } = CustomerDebtUtil.buildBulkInsertData(
        customer_id,
        debts,
        productMap
      );

      const result = await client.query(CustomerDebtSql.bulkInsert(placeholders, values));
      await ProductService.deductStock(debts);

      await client.query("COMMIT");

      return result.rows;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
};

export default CustomerDebtService;
