import { describe, expect, it } from "vitest";
import SaleUtil from "../../src/utils/saleUtil.js";
import Constant from "../../src/constants.js";

describe("SaleUtil", () => {
  describe("buildBulkInsertData", () => {
    it("should build placeholders and values", () => {
      const saleItems = [
        {
          product_id: 1,
          quantity: 2
        },
        {
          product_id: 2,
          quantity: 3
        }
      ];
      const productMap = new Map<number, string>([
        [1, "25.00"],
        [2, "40.00"]
      ]);
      const result = SaleUtil.buildBulkInsertData(10, saleItems, productMap);

      expect(result).toEqual({
        placeholders: ["($1, $2, $3, $4)", "($5, $6, $7, $8)"],
        values: [10, 1, 2, "25.00", 10, 2, 3, "40.00"]
      });
    });

    it("should throw when product does not exist", () => {
      const saleItems = [
        {
          product_id: 999,
          quantity: 2
        }
      ];
      const productMap = new Map<number, string>();

      expect(() => SaleUtil.buildBulkInsertData(1, saleItems, productMap)).toThrow(
        Constant.ERROR_MESSAGES.ID_NOT_FOUND("Product", 999)
      );
    });
  });

  describe("buildSale", () => {
    it("should calculate total and build sale items", () => {
      const saleItems = [
        {
          product_id: 1,
          quantity: 2
        },
        {
          product_id: 2,
          quantity: 3
        }
      ];
      const productMap = new Map([
        [
          1,
          {
            id: 1,
            name: "Coca-Cola",
            selling_price: "25.00",
            stock_quantity: 100
          }
        ],
        [
          2,
          {
            id: 2,
            name: "Bread",
            selling_price: "40.00",
            stock_quantity: 50
          }
        ]
      ]);
      const result = SaleUtil.buildSale(saleItems, productMap);

      expect(result).toEqual({
        total: 170,
        saleItems: [
          {
            product_id: 1,
            quantity: 2,
            unit_price: "25.00"
          },
          {
            product_id: 2,
            quantity: 3,
            unit_price: "40.00"
          }
        ]
      });
    });

    it("should throw when product does not exist", () => {
      const saleItems = [
        {
          product_id: 999,
          quantity: 2
        }
      ];
      const productMap = new Map();

      expect(() => SaleUtil.buildSale(saleItems, productMap)).toThrow(
        Constant.ERROR_MESSAGES.ID_NOT_FOUND("Product", 999)
      );
    });

    it("should throw when requested quantity exceeds stock", () => {
      const saleItems = [
        {
          product_id: 1,
          quantity: 20
        }
      ];
      const productMap = new Map([
        [
          1,
          {
            id: 1,
            name: "Coca-Cola",
            selling_price: "25.00",
            stock_quantity: 10
          }
        ]
      ]);

      expect(() => SaleUtil.buildSale(saleItems, productMap)).toThrow(
        Constant.ERROR_MESSAGES.SALES.STOCK("Coca-Cola")
      );
    });
  });
});
