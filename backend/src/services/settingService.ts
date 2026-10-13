import Constant from "../constants.js";
import { pool } from "../database/pool.js";
import SettingSql from "../database/sql/settingSql.js";
import { AppError } from "../errors/AppError.js";
import { SettingRequestBody } from "../interface.js";
import HashUtil from "../utils/hashUtil.js";
import JwtUtil from "../utils/jwtUtil.js";
import TransformUtil from "../utils/transformUtil.js";

const SettingService = {
  getSettings: async () => {
    const client = await pool.connect();

    try {
      const result = await client.query(SettingSql.select());
      return TransformUtil.omit(result.rows[0], "pin");
    } finally {
      client.release();
    }
  },

  updateSetting: async (setting: SettingRequestBody) => {
    const client = await pool.connect();

    try {
      let result;

      switch (true) {
        case setting.pin !== undefined: {
          const hashedPin = await HashUtil.hash(setting.pin);
          result = await client.query(SettingSql.updatePin(hashedPin));
          break;
        }

        case setting.theme !== undefined:
          result = await client.query(SettingSql.updateTheme(setting.theme));
          break;

        case setting.is_dark !== undefined:
          result = await client.query(SettingSql.updateDarkMode(setting.is_dark));
          break;

        default:
          throw new Error("No setting provided.");
      }

      return TransformUtil.omit(result.rows[0], "pin");
    } finally {
      client.release();
    }
  },

  verifyPin: async (pin: string) => {
    const client = await pool.connect();

    try {
      const result = await client.query(SettingSql.selectPin());
      const setting = result.rows[0];

      if (!setting) {
        throw new Error(Constant.ERROR_MESSAGES.SETTINGS.NOT_FOUND);
      }

      const isValid = await HashUtil.verify(setting.pin, pin);

      if (!isValid) {
        throw new AppError(400, Constant.ERROR_MESSAGES.SETTINGS.INVALID_PIN);
      }
    } finally {
      client.release();
    }
  },

  authenticate: async (pin: string) => {
    await SettingService.verifyPin(pin);
    return JwtUtil.generateToken();
  }
};

export default SettingService;
