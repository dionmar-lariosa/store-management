const CustomerDebtSql = {
  getCustomerDebts: (params: { customer?: string; orderBy: string }) => ({
    text: /* sql */ `
      SELECT
        *
      FROM
        get_customer_debts ($1, $2);
    `,
    values: [params.customer ?? null, params.orderBy]
  }),
  // calculateDebts: (params: { customer?: string; orderBy: string }) => {
  //   return {
  //     text: /* sql */ `
  //       SELECT
  //         c.id AS customer_id,
  //         c.name AS customer_name,
  //         SUM(cd.quantity * cd.unit_price) AS total_debt,
  //         COALESCE(
  //           (
  //             SELECT
  //               SUM(cp.amount)
  //             FROM
  //               customer_payments cp
  //             WHERE
  //               cp.customer_id = c.id
  //           ),
  //           0
  //         ) AS total_paid,
  //         SUM(cd.quantity * cd.unit_price) - COALESCE(
  //           (
  //             SELECT
  //               SUM(cp.amount)
  //             FROM
  //               customer_payments cp
  //             WHERE
  //               cp.customer_id = c.id
  //           ),
  //           0
  //         ) AS remaining_balance
  //       FROM
  //         customer_debts cd
  //         INNER JOIN customers c ON cd.customer_id = c.id
  //       WHERE
  //         (
  //           $1::text IS NULL
  //           OR c.name ILIKE '%' || $1 || '%'
  //         )
  //       GROUP BY
  //         c.id,
  //         c.name
  //       ORDER BY
  //         ${params.orderBy};
  //     `,
  //     values: [params.customer ?? null]
  //   };
  // },

  bulkInsert: (placeholders: string[], values: (number | string | undefined)[]) => {
    return {
      text: /* sql */ `
        INSERT INTO
          customer_debts (customer_id, product_id, quantity, unit_price)
        VALUES
          ${placeholders.join(", ")}
        RETURNING
          *;
      `,
      values
    };
  }
};

export default CustomerDebtSql;
