import { pool } from "../database/pool.js";
import { CustomerRequestBody } from "../interface.js";
import CustomerSql from "../database/sql/customerSql.js";
import EnsureUtil from "../utils/ensureUtil.js";

const CustomerService = {
  getCustomers: async (customer?: string) => {
    const client = await pool.connect();

    try {
      const result = await client.query(CustomerSql.selectAll(customer));
      return result.rows;
    } finally {
      client.release();
    }
  },

  getCustomer: async (id: number) => {
    const client = await pool.connect();

    try {
      // Execute Queries
      const queries = CustomerSql.selectProfile(id);
      const customerResult = await client.query(queries.customer);
      const debtsResult = await client.query(queries.debts);
      const paymentsResult = await client.query(queries.payments);
      const summaryResult = await client.query(queries.summary);

      // CUSTOMER
      EnsureUtil.ensureFound(customerResult.rowCount, "Customer", id);
      const customer = customerResult.rows[0];

      // DEBTS
      const debts = debtsResult.rows.map((debt) => ({
        ...debt,
        unit_price: Number(debt.unit_price),
        total: Number(debt.total)
      }));

      // PAYMENT
      const payments = paymentsResult.rows.map((payment) => ({
        ...payment,
        amount: Number(payment.amount)
      }));

      // SUMMARY
      const summary = summaryResult.rows[0];
      const totalDebt = Number(summary.total_debt);
      const totalPaid = Number(summary.total_paid);

      return {
        customer,
        summary: {
          total_debt: totalDebt,
          total_paid: totalPaid,
          remaining_balance: totalDebt - totalPaid
        },
        debts,
        payments
      };
    } finally {
      client.release();
    }
  },

  createCustomer: async (customer: CustomerRequestBody) => {
    const client = await pool.connect();

    try {
      const result = await client.query(CustomerSql.insert(customer));
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  updateCustomer: async (id: number, customer: CustomerRequestBody) => {
    const client = await pool.connect();

    try {
      const result = await client.query(CustomerSql.update(id, customer));
      EnsureUtil.ensureFound(result.rowCount, "Customer", id);

      return result.rows[0];
    } finally {
      client.release();
    }
  },

  deleteCustomer: async (id: number) => {
    const client = await pool.connect();

    try {
      const result = await client.query(CustomerSql.delete(id));
      EnsureUtil.ensureFound(result.rowCount, "Customer", id);

      return result.rowCount;
    } finally {
      client.release();
    }
  }
};

export default CustomerService;
