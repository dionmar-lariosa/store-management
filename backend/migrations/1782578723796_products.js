export const up = (pgm) => {
  pgm.createTable("products", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true
    },
    category_id: {
      type: "integer",
      references: "categories(id)",
      onDelete: "SET NULL" // If a category is deleted, set the category_id to NULL in products
    },
    name: {
      type: "varchar(255)",
      notNull: true
    },
    unit: {
      type: "varchar(20)",
      notNull: true,
      default: "pcs"
    },
    cost_price: {
      type: "numeric(10,2)",
      notNull: true,
      default: 0
    },
    selling_price: {
      type: "numeric(10,2)",
      notNull: true
    },
    stock_quantity: {
      type: "integer",
      notNull: true,
      default: 0
    },
    minimum_stock: {
      type: "integer",
      notNull: true,
      default: 0
    },
    image_url: {
      type: "text"
    },
    note: {
      type: "text"
    },
    is_active: {
      type: "boolean",
      notNull: true,
      default: true
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp")
    }
  });

  // Enforce non-negative values to maintain data integrity.
  pgm.addConstraint("products", "chk_products_cost_price", {
    check: "cost_price >= 0"
  });

  pgm.addConstraint("products", "chk_products_selling_price", {
    check: "selling_price >= 0"
  });

  pgm.addConstraint("products", "chk_products_stock_quantity", {
    check: "stock_quantity >= 0"
  });

  pgm.addConstraint("products", "chk_products_minimum_stock", {
    check: "minimum_stock >= 0"
  });

  pgm.createIndex("products", "category_id");
};

export const down = (pgm) => {
  pgm.dropTable("products");
};
