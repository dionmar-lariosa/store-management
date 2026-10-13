import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";
import seedDatabase from "../seedDatabase";

const URL = "/api/categories";

describe("Category API", () => {
  beforeEach(async () => {
    await seedDatabase({
      category: true,
      product: false,
      customer: false,
      customerDebt: false,
      sale: false
    });
  });

  describe("GET /categories", () => {
    it("returns categories", async () => {
      const response = await request(app).get(URL);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("POST /categories", () => {
    it("creates categories", async () => {
      const response = await request(app)
        .post(URL)
        .send([
          {
            name: "Food"
          }
        ]);
      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Array);
    });

    it("rejects duplicate names", async () => {
      const response = await request(app)
        .post(URL)
        .send([
          {
            name: "beverages"
          }
        ]);
      expect(response.status).toBe(409);
    });
  });

  describe("PUT /categories/:id", () => {
    it("updates category", async () => {
      const response = await request(app).put(`${URL}/1`).send({
        name: "Drinks"
      });
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Drinks");
    });

    it("returns 404", async () => {
      const response = await request(app).put(`${URL}/999`).send({
        name: "Drinks"
      });
      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /categories/:id", () => {
    it("deletes category", async () => {
      const response = await request(app).delete(`${URL}/1`);
      expect(response.status).toBe(204);
    });

    it("returns 404", async () => {
      const response = await request(app).delete(`${URL}/999`);
      expect(response.status).toBe(404);
    });
  });
});
