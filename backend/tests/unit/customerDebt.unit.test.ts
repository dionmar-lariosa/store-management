import { describe, expect, it } from "vitest";
import CustomerDebtUtil from "../../src/utils/customerDebtUtil.js";
import Constant from "../../src/constants.js";

describe("CustomerDebtUtil", () => {
  describe("buildBulkInsertData", () => {
    it("should build placeholders and values for a single debt", () => {
      const customerId = 1;
      const debts = [
        {
          product_id: 10,
          quantity: 5
        }
      ];
      const productMap = new Map<number, string>([[10, "100"]]);
      const result = CustomerDebtUtil.buildBulkInsertData(customerId, debts, productMap);

      expect(result.placeholders).toEqual(["($1, $2, $3, $4)"]);
      expect(result.values).toEqual([1, 10, 5, "100"]);
    });

    it("should build placeholders and values for multiple debts", () => {
      const customerId = 1;
      const debts = [
        {
          product_id: 10,
          quantity: 2
        },
        {
          product_id: 20,
          quantity: 4
        }
      ];
      const productMap = new Map<number, string>([
        [10, "100"],
        [20, "250"]
      ]);
      const result = CustomerDebtUtil.buildBulkInsertData(customerId, debts, productMap);

      expect(result.placeholders).toEqual(["($1, $2, $3, $4)", "($5, $6, $7, $8)"]);
      expect(result.values).toEqual([1, 10, 2, "100", 1, 20, 4, "250"]);
    });

    it("should throw when a product does not exist in the product map", () => {
      const customerId = 1;
      const debts = [
        {
          product_id: 99,
          quantity: 1
        }
      ];
      const productMap = new Map<number, string>();

      expect(() => CustomerDebtUtil.buildBulkInsertData(customerId, debts, productMap)).toThrow(
        Constant.ERROR_MESSAGES.ID_NOT_FOUND("Product", 99)
      );
    });
  });
});
