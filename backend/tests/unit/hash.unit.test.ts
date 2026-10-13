import { describe, expect, it } from "vitest";
import argon2 from "argon2";
import HashUtil from "../../src/utils/hashUtil.js";

describe("HashUtil", () => {
  describe("hash", () => {
    it("should hash a plain text value", async () => {
      const plainText = "1234";
      const hash = await HashUtil.hash(plainText);

      expect(hash).toEqual(expect.any(String));
      expect(hash).not.toBe(plainText);
      const isValid = await argon2.verify(hash, plainText);
      expect(isValid).toBe(true);
    });

    it("should generate different hashes for the same value", async () => {
      const plainText = "1234";

      const hash1 = await HashUtil.hash(plainText);
      const hash2 = await HashUtil.hash(plainText);

      expect(hash1).not.toBe(hash2);
      expect(await argon2.verify(hash1, plainText)).toBe(true);
      expect(await argon2.verify(hash2, plainText)).toBe(true);
    });
  });

  describe("verify", () => {
    it("should return true for a valid hash and value", async () => {
      const plainText = "1234";
      const hash = await HashUtil.hash(plainText);
      const result = await HashUtil.verify(hash, plainText);

      expect(result).toBe(true);
    });

    it("should return false for an invalid value", async () => {
      const plainText = "1234";
      const hash = await HashUtil.hash(plainText);
      const result = await HashUtil.verify(hash, "4321");

      expect(result).toBe(false);
    });
  });
});
