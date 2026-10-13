export const up = (pgm) => {
  pgm.createTable("customer_debts", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true
    },
    customer_id: {
      type: "integer",
      notNull: true,
      references: "customers(id)",
      onDelete: "CASCADE"
    },
    product_id: {
      type: "integer",
      notNull: true,
      references: "products(id)",
      onDelete: "RESTRICT" // cant be delete aslong as its attach to product
    },
    quantity: {
      type: "integer",
      notNull: true,
      default: 1
    },
    unit_price: {
      type: "numeric(10,2)",
      notNull: true
    },
    note: {
      type: "text"
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp")
    }
  });

  pgm.addConstraint("customer_debts", "chk_customer_debts_quantity", {
    check: "quantity > 0"
  });

  pgm.addConstraint("customer_debts", "chk_customer_debts_unit_price", {
    check: "unit_price >= 0"
  });

  pgm.createIndex("customer_debts", "customer_id");
  pgm.createIndex("customer_debts", "product_id");
};

export const down = (pgm) => {
  pgm.dropTable("customer_debts");
};
