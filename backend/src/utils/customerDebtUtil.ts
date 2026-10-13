import { CustomerDebtRequestBody } from "../interface.js";
import EnsureUtil from "./ensureUtil.js";

const CustomerDebtUtil = {
  buildBulkInsertData: (
    customer_id: number,
    debts: CustomerDebtRequestBody["debts"],
    productMap: Map<number, string>
  ) => {
    const placeholders: string[] = [];
    const values: (number | string)[] = [];

    debts.forEach((debt, index) => {
      const unitPrice = productMap.get(debt.product_id);
      EnsureUtil.ensureDefined(unitPrice, "Product", debt.product_id);

      const offset = index * 4;
      placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`);

      values.push(
        customer_id,
        debt.product_id,
        debt.quantity,
        unitPrice! // Trust me unitPrice is not undifined because of EnsureUtil.ensureDefined
      );
    });

    return {
      placeholders,
      values
    };
  }
};

export default CustomerDebtUtil;
