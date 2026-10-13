import { SaleQueryParams, SaleRequestBody } from "../../interface.js";

const SaleSql = {
  selectAll: (params: SaleQueryParams) => {
    return {
      text: /* sql */ `
        SELECT
          s.*
        FROM
          sales s
        WHERE
          (
            $1::text IS NULL
            OR s.status = $1
          )
          AND (
            $2::text IS NULL
            OR s.payment_method = $2
          )
          AND (
            (
              $3::date IS NULL
              AND $4::date IS NULL
            )
            OR DATE (s.created_at) BETWEEN $3 AND $4
          )
        ORDER BY
          s.created_at ${params.order ?? "DESC"};
      `,
      values: [
        params.status ?? null,
        params.payment_method ?? null,
        params.start_date ?? null,
        params.end_date ?? null
      ]
    };
  },

  select: (id: number) => {
    const sale = {
      text: /* sql */ `
        SELECT
          *
        FROM
          sales
        WHERE
          id = $1;
      `,
      values: [id]
    };

    const saleItems = {
      text: /* sql */ `
        SELECT
          si.*,
          p.name AS product_name,
          p.unit
        FROM
          sale_items si
          INNER JOIN products p ON p.id = si.product_id
        WHERE
          si.sale_id = $1
        ORDER BY
          si.id ASC;
      `,
      values: [id]
    };

    return {
      sale,
      saleItems
    };
  },

  insert: (sale: SaleRequestBody, total: number) => {
    return {
      text: /* sql */ `
        INSERT INTO
          sales (customer_id, total, payment_method, status)
        VALUES
          ($1, $2, $3, $4)
        RETURNING
          *;
      `,
      values: [sale.customer_id, total, sale.payment_method, sale.status]
    };
  },

  bulkInsert: (placeholders: string[], values: (number | string)[]) => {
    return {
      text: /* sql */ `
        INSERT INTO
          sale_items (sale_id, product_id, quantity, unit_price)
        VALUES
          ${placeholders.join(", ")}
        RETURNING
          *;
      `,
      values
    };
  },

  updateToVoid: (id: number) => {
    return {
      text: /* sql */ `
        UPDATE sales
        SET
          status = 'VOID'
        WHERE
          id = $1
        RETURNING
          *;
      `,
      values: [id]
    };
  }
};

export default SaleSql;
