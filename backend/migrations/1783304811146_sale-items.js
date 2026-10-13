export async function up(pgm) {
  pgm.createTable("sale_items", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true
    },
    sale_id: {
      type: "integer",
      references: "sales(id)",
      onDelete: "CASCADE",
      notNull: true
    },
    product_id: {
      type: "integer",
      references: "products(id)",
      onDelete: "RESTRICT",
      notNull: true
    },
    quantity: {
      type: "integer",
      notNull: true
    },
    unit_price: {
      type: "numeric(10,2)",
      notNull: true
    }
  });
}

export async function down(pgm) {
  pgm.dropTable("sale_items");
}
