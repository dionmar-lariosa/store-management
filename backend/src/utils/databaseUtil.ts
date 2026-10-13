import { DatabaseError } from "pg";
import { AppError } from "../errors/AppError.js";
import Constant from "../constants.js";

const DatabaseUtil = {
  uniqueViolation: (error: unknown) => {
    if (
      error instanceof DatabaseError &&
      error.code === Constant.ERROR_MESSAGES.PG_ERROR.UNIQUE_VIOLATION
    ) {
      throw new AppError(409, error.detail ?? "");
    }
  }
};

export default DatabaseUtil;
