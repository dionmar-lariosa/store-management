const Constant = {
  ERROR_MESSAGES: {
    ID_NOT_FOUND: (entity: string, id: number) => `${entity} with ID ${id} not found.`,
    STATUS_404: "Resource not found.",
    STATUS_500: "Internal server error.",
    SALES: {
      STOCK: (productName: string) => `Insufficient stock for product ${productName}.`,
      VOID: (id: number) => `Sale with ID ${id} has already been voided.`
    },
    SETTINGS: {
      NOT_FOUND: "Settings not found.",
      INVALID_PIN: "Invalid PIN."
    },
    PG_ERROR: {
      UNIQUE_VIOLATION: "23505"
    }
  },
  LOG_MESSAGES: {
    SERVER_START: (port: number) => `Store Management listening on port ${port}.`,
    SERVER_HEALTH_CHECK: "Store Management API is running."
  },
  STATUS_MESSAGES: {
    OK: "Ok",
    ERROR: "Error",
    CONNECTED: "Connected",
    SALES: {
      STATUS: {
        PAID: "PAID",
        PARTIAL: "PARTIAL",
        UNPAID: "UNPAID",
        VOID: "VOID"
      }
    }
  }
};

export default Constant;
