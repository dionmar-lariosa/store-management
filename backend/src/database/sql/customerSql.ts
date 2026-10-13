import { CustomerRequestBody } from "../../interface.js";

const CustomerSql = {
  selectAll: (customer?: string) => {
    return {
      text: /* sql */ `
        SELECT
          *
        FROM
          customers
        WHERE
          (
            $1::text IS NULL
            OR name ILIKE '%' || $1 || '%'
          );
      `,
      values: [customer ?? null]
    };
  },

  selectProfile: (id: number) => {
    const customer = {
      text: /* sql */ `
        SELECT
          *
        FROM
          customers
        WHERE
          id = $1;
      `,
      values: [id]
    };

    const debts = {
      text: /* sql */ `
        SELECT
          cd.*,
          p.name AS product_name,
          (cd.quantity * cd.unit_price) AS total
        FROM
          customer_debts cd
          INNER JOIN products p ON p.id = cd.product_id
        WHERE
          cd.customer_id = $1
        ORDER BY
          cd.created_at DESC;
      `,
      values: [id]
    };

    const payments = {
      text: /* sql */ `
        SELECT
          *
        FROM
          customer_payments
        WHERE
          customer_id = $1
        ORDER BY
          created_at DESC;
      `,
      values: [id]
    };

    const summary = {
      text: /* sql */ `
        SELECT
          COALESCE(
            (
              SELECT
                SUM(quantity * unit_price)
              FROM
                customer_debts
              WHERE
                customer_id = $1
            ),
            0
          ) AS total_debt,
          COALESCE(
            (
              SELECT
                SUM(amount)
              FROM
                customer_payments
              WHERE
                customer_id = $1
            ),
            0
          ) AS total_paid;
      `,
      values: [id]
    };
    return {
      customer,
      debts,
      payments,
      summary
    };
  },

  insert: (customer: CustomerRequestBody) => {
    return {
      text: /* sql */ `
        INSERT INTO
          customers (name, avatar_url, phone_number)
        VALUES
          ($1, $2, $3)
        RETURNING
          *;
      `,
      values: [customer.name, customer.avatar_url, customer.phone_number]
    };
  },

  update: (id: number, customer: CustomerRequestBody) => {
    return {
      text: /* sql */ `
        UPDATE customers
        SET
          name = $1,
          avatar_url = $2,
          phone_number = $3
        WHERE
          id = $4
        RETURNING
          *;
      `,
      values: [customer.name, customer.avatar_url, customer.phone_number, id]
    };
  },

  delete: (id: number) => {
    return {
      text: /* sql */ `
        DELETE FROM customers
        WHERE
          id = $1;
      `,
      values: [id]
    };
  }
};

export default CustomerSql;
