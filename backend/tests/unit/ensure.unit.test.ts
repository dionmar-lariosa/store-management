import { describe, expect, it } from "vitest";
import EnsureUtil from "../../src/utils/ensureUtil.js";
import Constant from "../../src/constants.js";

describe("EnsureUtil", () => {
  describe("ensureFound", () => {
    it("should not throw when ref is greater than 0", () => {
      expect(() => {
        EnsureUtil.ensureFound(1, "Customer", 1);
      }).not.toThrow();
    });

    it("should throw when ref is 0", () => {
      expect(() => {
        EnsureUtil.ensureFound(0, "Customer", 1);
      }).toThrow(Constant.ERROR_MESSAGES.ID_NOT_FOUND("Customer", 1));
    });

    it("should throw when ref is null", () => {
      expect(() => {
        EnsureUtil.ensureFound(null, "Customer", 1);
      }).toThrow(Constant.ERROR_MESSAGES.ID_NOT_FOUND("Customer", 1));
    });
  });

  describe("ensureDefined", () => {
    it("should not throw when value is defined", () => {
      expect(() => {
        EnsureUtil.ensureDefined("60.00", "Product", 1);
      }).not.toThrow();
    });

    it("should throw when value is undefined", () => {
      expect(() => {
        EnsureUtil.ensureDefined(undefined, "Product", 1);
      }).toThrow(Constant.ERROR_MESSAGES.ID_NOT_FOUND("Product", 1));
    });
  });
});
