export function up(pgm) {
  pgm.createTable("customers", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true
    },
    name: {
      type: "varchar(255)",
      notNull: true
    },
    avatar_url: {
      type: "text"
    },
    phone_number: {
      type: "varchar(50)"
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp")
    }
  });
}

export function down(pgm) {
  pgm.dropTable("customers");
}
