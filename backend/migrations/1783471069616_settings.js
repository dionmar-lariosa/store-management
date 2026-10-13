import argon2 from "argon2";

export async function up(pgm) {
  pgm.createTable("settings", {
    pin: {
      type: "text",
      notNull: true,
      default: ""
    },
    theme: {
      type: "varchar(20)",
      notNull: true,
      default: "default",
      check: "theme IN ('default', 'blue', 'green', 'purple', 'red')"
    },
    is_dark: {
      type: "boolean",
      default: false,
      notNull: true
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("CURRENT_TIMESTAMP"),
      notNull: true
    },
    updated_at: {
      type: "timestamp",
      default: pgm.func("CURRENT_TIMESTAMP"),
      notNull: true
    }
  });

  // Initialize the single settings row.
  const hash = await argon2.hash("1234");
  pgm.sql(`
    INSERT INTO settings (pin, theme, is_dark)
    VALUES ('${hash}', 'default', false);
  `);
}

export async function down(pgm) {
  pgm.dropTable("settings");
}
