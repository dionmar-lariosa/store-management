import { pool } from "../src/database/pool.js";

export default async function seedDatabase(options: {
  category: boolean;
  product: boolean;
  customer: boolean;
  customerDebt: boolean;
  sale: boolean;
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(/* sql */ `
      TRUNCATE TABLE customer_payments,
      customer_debts,
      products,
      customers,
      categories,
      sales,
      sale_items RESTART IDENTITY CASCADE;
    `);

    if (options.category) {
      await client.query(/* sql */ `
        INSERT INTO
          categories (name)
        VALUES
          ('beverages')
      `);
    }
    if (options.product) {
      await client.query(/* sql */ `
        INSERT INTO
          products (
            category_id,
            name,
            unit,
            cost_price,
            selling_price,
            stock_quantity,
            minimum_stock,
            image_url
          )
        VALUES
          (1, 'Coca-Cola', 'Bottle', 18, 25, 100, 10, NULL),
          (1, 'Royal', 'Bottle', 18, 25, 100, 10, NULL)
      `);
    }

    if (options.customer) {
      await client.query(/* sql */ `
        INSERT INTO
          customers (name, avatar_url, phone_number)
        VALUES
          ('Dion', NULL, '09171234567'),
          ('Limnarah', NULL, '09171234567'),
          ('Laravil', NULL, '09171234567')
      `);
    }

    if (options.customerDebt) {
      await client.query(/* sql */ `
        INSERT INTO
          customer_debts (customer_id, product_id, quantity, unit_price)
        VALUES
          (1, 1, 1, 25.00),
          (2, 1, 2, 25.00),
          (3, 1, 2, 25.00)
      `);
    }

    if (options.sale) {
      const sales = await client.query(/* sql */ `
        INSERT INTO
          sales (
            customer_id,
            total,
            payment_method,
            status,
            created_at
          )
        VALUES
          (NULL, 50, 'GCASH', 'PAID', '2026-07-01 10:00:00'),
          (NULL, 25, 'CASH', 'PAID', '2026-07-05 15:30:00')
        RETURNING
          id;
      `);

      await client.query(
        /* sql */ `
          INSERT INTO
            sale_items (sale_id, product_id, quantity, unit_price)
          VALUES
            ($1, 1, 2, 25.00),
            ($2, 2, 1, 25.00);
        `,
        [sales.rows[0].id, sales.rows[1].id]
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
