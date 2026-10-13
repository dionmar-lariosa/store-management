import Constant from "../constants.js";
import { AppError } from "../errors/AppError.js";
import { ProductMap, SaleRequestBody } from "../interface.js";
import EnsureUtil from "./ensureUtil.js";

const SaleUtil = {
  buildBulkInsertData: (
    saleId: number,
    saleItems: SaleRequestBody["sale_items"],
    productMap: Map<number, string>
  ) => {
    const placeholders: string[] = [];
    const values: (number | string)[] = [];

    saleItems.forEach((item, index) => {
      const unitPrice = productMap.get(item.product_id);
      EnsureUtil.ensureDefined(unitPrice, "Product", item.product_id);

      const offset = index * 4;
      placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`);
      values.push(saleId, item.product_id, item.quantity, unitPrice!);
    });

    return {
      placeholders,
      values
    };
  },

  buildSale: (saleItems: SaleRequestBody["sale_items"], productMap: Map<number, ProductMap>) => {
    let total = 0;
    const builtSaleItems = saleItems.map((item) => {
      const product = productMap.get(item.product_id);

      if (!product) {
        throw new Error(Constant.ERROR_MESSAGES.ID_NOT_FOUND("Product", item.product_id));
      }

      if (item.quantity > product.stock_quantity) {
        throw new AppError(409, Constant.ERROR_MESSAGES.SALES.STOCK(product.name));
      }

      total += Number(product.selling_price) * item.quantity;

      return {
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.selling_price
      };
    });

    return {
      total,
      saleItems: builtSaleItems
    };
  }
};

export default SaleUtil;
