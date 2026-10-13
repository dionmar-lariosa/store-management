import { pool } from "../database/pool.js";
import CustomerPaymentSql from "../database/sql/customerPaymentSql.js";
import { CustomerPaymentRequestBody } from "../interface.js";

const CustomerPaymentService = {
  addCustomerPayment: async (payment: CustomerPaymentRequestBody) => {
    const client = await pool.connect();

    try {
      const result = await client.query(CustomerPaymentSql.insert(payment));
      return result.rows[0];
    } finally {
      client.release();
    }
  }
};

export default CustomerPaymentService;
