import { CustomerPaymentRequestBody } from "../../interface.js";

const CustomerPaymentSql = {
  insert: (payment: CustomerPaymentRequestBody) => {
    return {
      text: /* sql */ `
        INSERT INTO
          customer_payments (customer_id, amount, note)
        VALUES
          ($1, $2, $3)
        RETURNING
          *;
      `,
      values: [payment.customer_id, payment.amount, payment.note]
    };
  }
};

export default CustomerPaymentSql;
