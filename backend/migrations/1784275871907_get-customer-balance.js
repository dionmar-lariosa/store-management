export const up = (pgm) => {
  pgm.sql(`
    CREATE OR REPLACE FUNCTION get_customer_debts(
      p_customer TEXT DEFAULT NULL,
      p_sort TEXT DEFAULT 'highest_debt'
    )
    RETURNS TABLE (
      customer_id INT,
      customer_name VARCHAR,
      total_debt NUMERIC,
      total_paid NUMERIC,
      remaining_balance NUMERIC
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
      RETURN QUERY
      SELECT
        c.id AS customer_id,
        c.name AS customer_name,

        SUM(cd.quantity * cd.unit_price) AS total_debt,

        COALESCE(
          (
            SELECT SUM(cp.amount)
            FROM customer_payments cp
            WHERE cp.customer_id = c.id
          ),
          0
        ) AS total_paid,

        SUM(cd.quantity * cd.unit_price)
        -
        COALESCE(
          (
            SELECT SUM(cp.amount)
            FROM customer_payments cp
            WHERE cp.customer_id = c.id
          ),
          0
        ) AS remaining_balance

      FROM customer_debts cd
      INNER JOIN customers c
        ON cd.customer_id = c.id

      WHERE
        (
          p_customer IS NULL
          OR c.name ILIKE '%' || p_customer || '%'
        )

      GROUP BY
        c.id,
        c.name

      ORDER BY
        CASE
          WHEN p_sort = 'highest_debt'
          THEN SUM(cd.quantity * cd.unit_price)
        END DESC,

        CASE
          WHEN p_sort = 'lowest_debt'
          THEN SUM(cd.quantity * cd.unit_price)
        END ASC;
    END;
    $$;
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP FUNCTION IF EXISTS get_customer_debts(TEXT, TEXT);
  `);
};
