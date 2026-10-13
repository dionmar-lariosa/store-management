import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import Constant from "../../src/constants.js";

describe("App", () => {
  describe("GET /api", () => {
    it("return server healt check message", async () => {
      const response = await request(app).get("/api");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: Constant.LOG_MESSAGES.SERVER_HEALTH_CHECK
      });
    });
  });
});
