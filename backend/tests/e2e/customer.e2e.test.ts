import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import seedDatabase from "../seedDatabase.js";

const URL = "/api/customers";

describe("Customer API", () => {
  beforeEach(async () => {
    await seedDatabase({
      category: false,
      product: false,
      customer: true,
      customerDebt: false,
      sale: false
    });
  });

  describe("GET /customers", () => {
    it("returns customers", async () => {
      const response = await request(app).get(URL);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it("filters by customer", async () => {
      const response = await request(app).get(URL).query({ customer: "Dion" });
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe("Dion");
    });

    it("returns empty array", async () => {
      const response = await request(app).get(URL).query({ customer: "Unknown" });
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("GET /customers/:id", () => {
    it("returns customer profile", async () => {
      const response = await request(app).get(`${URL}/1`);
      expect(response.status).toBe(200);
      expect(response.body.customer.id).toBe(1);
    });

    it("returns 404", async () => {
      const response = await request(app).get(`${URL}/999`);
      expect(response.status).toBe(404);
    });
  });

  describe("POST /customers", () => {
    it("creates customer", async () => {
      const response = await request(app).post(URL).send({
        name: "Pawski",
        avatar_url: null,
        phone_number: "09999999999"
      });
      expect(response.status).toBe(201);
      expect(response.body.name).toBe("Pawski");
    });
  });

  describe("PUT /customers/:id", () => {
    it("updates customer", async () => {
      const response = await request(app).put(`${URL}/1`).send({
        name: "Dion Updated",
        avatar_url: null,
        phone_number: "09170000000"
      });
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Dion Updated");
    });

    it("returns 404", async () => {
      const response = await request(app).put(`${URL}/999`).send({
        name: "Unknown",
        avatar_url: null,
        phone_number: null
      });
      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /customers/:id", () => {
    it("deletes customer", async () => {
      const response = await request(app).delete(`${URL}/1`);
      expect(response.status).toBe(204);
    });
    it("returns 404", async () => {
      const response = await request(app).delete(`${URL}/999`);
      expect(response.status).toBe(404);
    });
  });
});
