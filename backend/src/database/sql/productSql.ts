import { ProductQueryParams, ProductRequestBody } from "../../interface.js";

const ProductSql = {
  selectAll: (params: ProductQueryParams) => {
    return {
      text: /* sql */ `
        SELECT
          p.id,
          c.name AS category_name,
          p.name,
          p.selling_price,
          p.stock_quantity,
          p.image_url,
          p.is_active
        FROM
          products p
          LEFT JOIN categories c ON p.category_id = c.id
        WHERE
          (
            $1::text IS NULL
            OR p.name ILIKE '%' || $1 || '%'
          )
          AND (
            $2::text IS NULL
            OR c.name ILIKE '%' || $2 || '%'
          )
          AND (
            $3::boolean IS NULL
            OR p.is_active = $3
          )
        ORDER BY
          p.created_at ${params.order ?? "DESC"};
      `,
      values: [params.product ?? null, params.category ?? null, params.is_active ?? null]
    };
  },

  select: (id: number) => {
    return {
      text: /* sql */ `
        SELECT
          p.*,
          c.name AS category_name
        FROM
          products p
          LEFT JOIN categories c ON p.category_id = c.id
        WHERE
          p.id = $1;
      `,
      values: [id]
    };
  },

  selectByIds: (productIds: number[]) => {
    return {
      text: /* sql */ `
        SELECT
          id,
          name,
          selling_price,
          stock_quantity
        FROM
          products
        WHERE
          id = ANY ($1::int[])
          AND is_active = true;
      `,
      values: [productIds]
    };
  },

  insert: (product: ProductRequestBody) => {
    return {
      text: /* sql */ `
        INSERT INTO
          products (
            category_id,
            name,
            unit,
            cost_price,
            selling_price,
            stock_quantity,
            minimum_stock,
            image_url,
            note
          )
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING
          *;
      `,
      values: [
        product.category_id,
        product.name,
        product.unit,
        product.cost_price,
        product.selling_price,
        product.stock_quantity,
        product.minimum_stock,
        product.image_url,
        product.note
      ]
    };
  },

  update: (id: number, product: ProductRequestBody) => {
    return {
      text: /* sql */ `
        UPDATE products
        SET
          category_id = $1,
          name = $2,
          unit = $3,
          cost_price = $4,
          selling_price = $5,
          stock_quantity = $6,
          minimum_stock = $7,
          image_url = $8,
          note = $9
        WHERE
          id = $10
        RETURNING
          *;
      `,
      values: [
        product.category_id,
        product.name,
        product.unit,
        product.cost_price,
        product.selling_price,
        product.stock_quantity,
        product.minimum_stock,
        product.image_url,
        product.note,
        id
      ]
    };
  },

  updateIsActive: (id: number, value: { is_active: boolean }) => {
    return {
      text: /* sql */ `
        UPDATE products
        SET
          is_active = $1
        WHERE
          id = $2
        RETURNING
          id;
      `,
      values: [value.is_active, id]
    };
  },

  deductStock: (placeholders: string[], values: number[]) => {
    return {
      text: /* sql */ `
        UPDATE products p
        SET
          stock_quantity = p.stock_quantity - v.quantity
        FROM
          (
            VALUES
              ${placeholders.join(", ")}
          ) AS v (id, quantity)
        WHERE
          p.id = v.id
        RETURNING
          p.*;
      `,
      values
    };
  },

  increaseStock: (placeholders: string[], values: number[]) => {
    return {
      text: /* sql */ `
        UPDATE products p
        SET
          stock_quantity = p.stock_quantity + v.quantity
        FROM
          (
            VALUES
              ${placeholders.join(", ")}
          ) AS v (id, quantity)
        WHERE
          p.id = v.id
        RETURNING
          p.*;
      `,
      values
    };
  }
};

export default ProductSql;
