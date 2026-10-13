const SettingSql = {
  select: () => {
    return {
      text: /* sql */ `
        SELECT
          *
        FROM
          settings
        LIMIT
          1;
      `
    };
  },

  selectPin: () => {
    return {
      text: /* sql */ `
        SELECT
          pin
        FROM
          settings
        LIMIT
          1;
      `
    };
  },

  updatePin: (hashedPin: string) => {
    return {
      text: /* sql */ `
        UPDATE settings
        SET
          pin = $1,
          updated_at = CURRENT_TIMESTAMP
        RETURNING
          *;
      `,
      values: [hashedPin]
    };
  },

  updateTheme: (theme: string) => {
    return {
      text: /* sql */ `
        UPDATE settings
        SET
          theme = $1,
          updated_at = CURRENT_TIMESTAMP
        RETURNING
          *;
      `,
      values: [theme]
    };
  },

  updateDarkMode: (isDark: boolean) => {
    return {
      text: /* sql */ `
        UPDATE settings
        SET
          is_dark = $1,
          updated_at = CURRENT_TIMESTAMP
        RETURNING
          *;
      `,
      values: [isDark]
    };
  }
};

export default SettingSql;
