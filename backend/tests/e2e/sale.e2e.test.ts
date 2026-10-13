import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";
import seedDatabase from "../seedDatabase";

const URL = "/api/sales";

describe("Sales API", () => {
  beforeEach(async () => {
    await seedDatabase({
      category: true,
      product: true,
      customer: true,
      customerDebt: false,
      sale: true
    });
  });

  describe("GET /sales", () => {
    it("returns sales", async () => {
      const response = await request(app).get(URL);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
    it("filters by status", async () => {
      const response = await request(app).get(URL).query({ status: "PAID" });
      expect(response.status).toBe(200);
    });
    it("filters by payment method", async () => {
      const response = await request(app).get(URL).query({ payment_method: "GCASH" });
      expect(response.status).toBe(200);
    });
    it("filters by date", async () => {
      const response = await request(app).get(URL).query({
        start_date: "2026-07-02",
        end_date: "2026-07-06"
      });
      expect(response.status).toBe(200);
    });
  });

  describe("GET /sales/:id", () => {
    it("returns sale", async () => {
      const response = await request(app).get(`${URL}/1`);
      expect(response.status).toBe(200);
      expect(response.body.sale.id).toBe(1);
    });
    it("returns 404", async () => {
      const response = await request(app).get(`${URL}/999`);
      expect(response.status).toBe(404);
    });
  });

  describe("POST /sales", () => {
    it("creates sale", async () => {
      const response = await request(app)
        .post(URL)
        .send({
          customer_id: null,
          payment_method: "GCASH",
          status: "PAID",
          sale_items: [
            {
              product_id: 1,
              quantity: 2
            }
          ]
        });
      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
    });

    it("returns 409 when stock is insufficient", async () => {
      const response = await request(app)
        .post(URL)
        .send({
          customer_id: null,
          payment_method: "GCASH",
          status: "PAID",
          sale_items: [
            {
              product_id: 1,
              quantity: 1000
            }
          ]
        });
      expect(response.status).toBe(409);
    });
  });

  describe("PATCH /sales/:id", () => {
    it("voids sale", async () => {
      const response = await request(app).patch(`${URL}/1`).send({
        pin: "1234"
      });
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("VOID");
    });
    it("returns 400 for invalid pin", async () => {
      const response = await request(app).patch(`${URL}/1`).send({
        pin: "9999"
      });
      expect(response.status).toBe(400);
    });
    it("returns 404", async () => {
      const response = await request(app).patch(`${URL}/999`).send({
        pin: "1234"
      });
      expect(response.status).toBe(404);
    });
  });
});
