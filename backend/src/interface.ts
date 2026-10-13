export type Order = "ASC" | "DESC";
/* SETTINGS */
export interface SettingRequestBody {
  pin?: string;
  theme?: string;
  is_dark?: boolean;
}
export type Theme = "default" | "blue" | "green" | "purple" | "red";
/* SETTINGS */

/* CATEGORIES */
export interface CategoryRequestBody {
  name: string;
}
/* CATEGORIES */

/* PRODUCTS */
export interface ProductRequestBody {
  category_id: number;
  name: string;
  unit: string;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  minimum_stock: number;
  image_url: string | null;
  note: string | null;
}
export interface ProductQueryParams {
  product?: string;
  category?: string;
  is_active?: boolean;
  order?: Order;
}
export interface ProductMap {
  id: number;
  name: string;
  selling_price: string;
  stock_quantity: number;
}
export interface StockMovement {
  product_id: number;
  quantity: number;
}
/* PRODUCTS */

/* SALES */
type PaymentMethod = "CASH" | "GCASH" | "CREDIT" | "DEBT";
type SaleStatus = "PAID" | "PARTIAL" | "UNPAID" | "VOID";
export interface SaleRequestBody {
  customer_id: number | null;
  status: SaleStatus;
  payment_method: PaymentMethod;
  sale_items: {
    product_id: number;
    quantity: number;
  }[];
}
export interface SaleQueryParams {
  start_date?: string;
  end_date?: string;
  status?: SaleStatus;
  payment_method?: PaymentMethod;
  order?: Order;
}
/* SALES */

/* CUSTOMERS */
export interface CustomerRequestBody {
  name: string;
  avatar_url: string | null;
  phone_number: string | null;
}
/* CUSTOMERS */

/* CUSTOMER-DEBTS */
export interface CustomerDebtRequestBody {
  customer_id: number;
  debts: { product_id: number; quantity: number }[];
}
/* CUSTOMER-DEBTS */

/* CUSTOMER-PAYMENTS */
export interface CustomerPaymentRequestBody {
  customer_id: number;
  amount: number;
  note: string | null;
}
export interface CustomerDebtQueryParams {
  customer?: string;
  sort?:
    | "highest_debt"
    | "lowest_debt"
    | "highest_paid"
    | "lowest_paid"
    | "highest_balance"
    | "lowest_balance"; 
}
/* CUSTOMER-PAYMENTS */
