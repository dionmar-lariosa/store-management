import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import seedDatabase from "../seedDatabase.js";

const URL = "/api/customer-debts";

describe("Customer Debt API", () => {
  beforeEach(async () => {
    await seedDatabase({
      category: true,
      product: true,
      customer: true,
      customerDebt: true,
      sale: false
    });
  });

  describe("GET /customer-debts", () => {
    it("returns customer debts", async () => {
      const response = await request(app).get(URL);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
    it("filters by customer", async () => {
      const response = await request(app).get(URL).query({ customer: "Dion" });
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].customer_name).toBe("Dion");
    });
    it("sorts by highest debt", async () => {
      const response = await request(app).get(URL).query({ sort: "highest_debt" });
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
    it("sorts by lowest debt", async () => {
      const response = await request(app).get(URL).query({ sort: "lowest_debt" });
      expect(response.status).toBe(200);
    });
    it("sorts by highest paid", async () => {
      const response = await request(app).get(URL).query({ sort: "highest_paid" });
      expect(response.status).toBe(200);
    });
    it("sorts by lowest paid", async () => {
      const response = await request(app).get(URL).query({ sort: "lowest_paid" });
      expect(response.status).toBe(200);
    });
    it("sorts by highest balance", async () => {
      const response = await request(app).get(URL).query({ sort: "highest_balance" });
      expect(response.status).toBe(200);
    });
    it("sorts by lowest balance", async () => {
      const response = await request(app).get(URL).query({ sort: "lowest_balance" });
      expect(response.status).toBe(200);
    });
    it("returns empty array", async () => {
      const response = await request(app).get(URL).query({ customer: "Unknown" });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("POST /customer-debts", () => {
    it("creates debt", async () => {
      const response = await request(app)
        .post(URL)
        .send({
          customer_id: 1,
          debts: [
            {
              product_id: 1,
              quantity: 2
            }
          ]
        });
      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(1);
    });

    it("creates multiple debts", async () => {
      const response = await request(app)
        .post(URL)
        .send({
          customer_id: 1,
          debts: [
            {
              product_id: 1,
              quantity: 1
            },
            {
              product_id: 1,
              quantity: 5
            }
          ]
        });
      expect(response.status).toBe(201);
      expect(response.body).toHaveLength(2);
    });

    it("returns 404 for invalid customer", async () => {
      const response = await request(app)
        .post(URL)
        .send({
          customer_id: 999,
          debts: [
            {
              product_id: 1,
              quantity: 2
            }
          ]
        });
      expect(response.status).toBe(404);
    });

    it("returns 404 for invalid product", async () => {
      const response = await request(app)
        .post(URL)
        .send({
          customer_id: 1,
          debts: [
            {
              product_id: 999,
              quantity: 2
            }
          ]
        });
      expect(response.status).toBe(404);
    });
  });
});
