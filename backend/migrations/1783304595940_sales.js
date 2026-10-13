export async function up(pgm) {
  pgm.createTable("sales", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true
    },
    customer_id: {
      type: "integer",
      references: "customers(id)",
      onDelete: "SET NULL",
      notNull: false
    },
    total: {
      type: "numeric(10,2)",
      notNull: true
    },
    payment_method: {
      type: "varchar(20)",
      notNull: true,
      check: "payment_method IN ('CASH', 'GCASH', 'CREDIT', 'DEBT')"
    },
    status: {
      type: "varchar(20)",
      notNull: true,
      check: "status IN ('PAID', 'PARTIAL', 'UNPAID', 'VOID')"
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("CURRENT_TIMESTAMP"),
      notNull: true
    }
  });
}

export async function down(pgm) {
  pgm.dropTable("sales");
}
