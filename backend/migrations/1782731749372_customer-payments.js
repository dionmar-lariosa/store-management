export const up = (pgm) => {
  pgm.createTable("customer_payments", {
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
    amount: {
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

  pgm.addConstraint("customer_payments", "chk_customer_payments_amount", {
    check: "amount > 0"
  });

  pgm.createIndex("customer_payments", "customer_id");
};

export const down = (pgm) => {
  pgm.dropTable("customer_payments");
};
