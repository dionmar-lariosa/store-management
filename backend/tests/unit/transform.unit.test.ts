import { describe, expect, it } from "vitest";
import TransformUtil from "../../src/utils/transformUtil.js";

describe("TransformUtil", () => {
  describe("omit", () => {
    it("should omit a single property", () => {
      const object = {
        id: 1,
        pin: "1234",
        theme: "default"
      };

      const result = TransformUtil.omit(object, "pin");
      expect(result).toEqual({
        id: 1,
        theme: "default"
      });
    });

    it("should omit multiple properties", () => {
      const object = {
        id: 1,
        pin: "1234",
        theme: "default",
        is_dark: false
      };

      const result = TransformUtil.omit(
        object,
        "pin",
        "is_dark"
      );

      expect(result).toEqual({
        id: 1,
        theme: "default"
      });
    });

    it("should not mutate the original object", () => {
      const object = {
        id: 1,
        pin: "1234",
        theme: "default"
      };

      TransformUtil.omit(object, "pin");

      expect(object).toEqual({
        id: 1,
        pin: "1234",
        theme: "default"
      });
    });
  });
});