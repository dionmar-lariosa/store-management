import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

const URL = "/api/settings";
let token = "";

describe("Settings API", () => {
  beforeAll(async () => {
    const response = await request(app).post(`${URL}/auth`).send({
      pin: "1234"
    });
    token = response.body.access_token;
  });

  describe("POST /settings/auth", () => {
    it("returns access token", async () => {
      const response = await request(app).post(`${URL}/auth`).send({
        pin: "1234"
      });
      expect(response.status).toBe(200);
      expect(response.body.access_token).toBeDefined();
    });

    it("returns 400", async () => {
      const response = await request(app).post(`${URL}/auth`).send({
        pin: "9999"
      });
      expect(response.status).toBe(400);
    });
  });

  describe("GET /settings", () => {
    it("returns settings", async () => {
      const response = await request(app).get(URL).set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).not.toHaveProperty("pin");
    });

    it("returns 401", async () => {
      const response = await request(app).get(URL);
      expect(response.status).toBe(401);
    });
  });

  describe("PATCH /settings", () => {
    it("updates theme", async () => {
      const response = await request(app).patch(URL).set("Authorization", `Bearer ${token}`).send({
        theme: "blue"
      });
      expect(response.status).toBe(200);
      expect(response.body.theme).toBe("blue");
    });
    it("updates dark mode", async () => {
      const response = await request(app).patch(URL).set("Authorization", `Bearer ${token}`).send({
        is_dark: true
      });
      expect(response.status).toBe(200);
      expect(response.body.is_dark).toBe(true);
    });
    it("updates pin", async () => {
      const response = await request(app).patch(URL).set("Authorization", `Bearer ${token}`).send({
        pin: "1234"
      });
      expect(response.status).toBe(200);
    });
  });
});
