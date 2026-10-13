import Constant from "../constants.js";
import { AppError } from "../errors/AppError.js";

const EnsureUtil = {
  ensureFound: (value: number | null, entity: string, id: number) => {
    if (value === 0 || value === null) {
      throw new AppError(404, Constant.ERROR_MESSAGES.ID_NOT_FOUND(entity, id));
    }
  },

  ensureDefined: (ref: string | undefined, entity: string, id: number) => {
    if (ref === undefined) {
      throw new AppError(404, Constant.ERROR_MESSAGES.ID_NOT_FOUND(entity, id));
    }
  }
};
export default EnsureUtil;
