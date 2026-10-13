export const up = (pgm) => {
  pgm.createTable("categories", {
    id: {
      type: "serial",
      primaryKey: true,
      notNull: true
    },
    name: {
      type: "varchar(100)",
      notNull: true,
      unique: true
    }
  });
};

export const down = (pgm) => {
  pgm.dropTable("categories");
};
