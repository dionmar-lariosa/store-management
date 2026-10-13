import { CategoryRequestBody } from "../../interface.js";

const CategorySql = {
  selectAll: "SELECT * FROM categories;",

  bulkInsert: (placeholders: string[], values: string[]) => {
    return {
      text: /* sql */ `
        INSERT INTO
          categories (name)
        VALUES
          ${placeholders.join(", ")}
        RETURNING
          *;
      `,
      values
    };
  },

  update: (id: number, category: CategoryRequestBody) => {
    return {
      text: /* sql */ `
        UPDATE categories
        SET
          name = $1
        WHERE
          id = $2
        RETURNING
          *;
      `,
      values: [category.name, id]
    };
  },

  delete: (id: number) => {
    return {
      text: /* sql */ `
        DELETE FROM categories
        WHERE
          id = $1;
      `,
      values: [id]
    };
  }
};

export default CategorySql;
