import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import seedDatabase from "../seedDatabase.js";

const URL = "/api/customer-payments";

describe("Customer Payment API", () => {
  beforeEach(async () => {
    await seedDatabase({
      category: true,
      product: true,
      customer: true,
      customerDebt: true,
      sale: false
    });
  });

  describe("POST /customer-payments", () => {
    it("creates payment", async () => {
      const response = await request(app).post(URL).send({
        customer_id: 1,
        amount: 50,
        note: "Partial payment"
      });

      expect(response.status).toBe(201);
      expect(response.body.customer_id).toBe(1);
    });
    // TODO TEST HERE AFTER DB UTIL ID NOT EXIST FOUND
    // it("returns 404", async () => {
    //   const response = await request(app).post(URL).send({
    //     customer_id: 999,
    //     amount: 50,
    //     note: null
    //   });

    //   expect(response.status).toBe(404);
    // });
  });
});
