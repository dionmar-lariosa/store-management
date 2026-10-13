import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";
import seedDatabase from "../seedDatabase";

const URL = "/api/products";

describe("Products API", () => {
  beforeEach(async () => {
    await seedDatabase({
      category: true,
      product: true,
      customer: false,
      customerDebt: false,
      sale: false
    });
  });

  describe("GET /products", () => {
    it("returns products", async () => {
      const response = await request(app).get(URL);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("filters by product", async () => {
      const response = await request(app).get(URL).query({ product: "Coca" });
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe("Coca-Cola");
    });

    it("filters by category", async () => {
      const response = await request(app).get(URL).query({ category: "beverages" });
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("returns empty array", async () => {
      const response = await request(app).get(URL).query({ product: "Unknown" });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("GET /products/:id", () => {
    it("returns product", async () => {
      const response = await request(app).get(`${URL}/1`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
    });

    it("returns 404", async () => {
      const response = await request(app).get(`${URL}/999`);
      expect(response.status).toBe(404);
    });
  });

  describe("POST /products", () => {
    it("creates product", async () => {
      const response = await request(app).post(URL).send({
        category_id: 1,
        name: "Sprite",
        unit: "Bottle",
        cost_price: 20,
        selling_price: 30,
        stock_quantity: 50,
        minimum_stock: 5
      });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe("Sprite");
    });
  });

  describe("PUT /products/:id", () => {
    it("updates product", async () => {
      const response = await request(app).put(`${URL}/1`).send({
        category_id: 1,
        name: "Sprite Zero",
        unit: "Bottle",
        cost_price: 22,
        selling_price: 35,
        stock_quantity: 100,
        minimum_stock: 8
      });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Sprite Zero");
    });

    it("returns 404", async () => {
      const response = await request(app).put(`${URL}/999`).send({
        category_id: 1,
        name: "Sprite",
        unit: "Bottle",
        cost_price: 20,
        selling_price: 30,
        stock_quantity: 50,
        minimum_stock: 5
      });

      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /products/:id", () => {
    it("update is_active", async () => {
      const response = await request(app).patch(`${URL}/1`).send({
        is_active: false
      });
      expect(response.status).toBe(200);
    });

    it("returns 404", async () => {
      const response = await request(app).patch(`${URL}/999`).send({
        is_active: false
      });
      expect(response.status).toBe(404);
    });
  });
});
