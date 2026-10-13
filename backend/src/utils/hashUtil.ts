import argon2 from "argon2";

const HashUtil = {
  hash: async (value: string) => await argon2.hash(value),
  verify: async (hash: string, value: string) => await argon2.verify(hash, value)
};

export default HashUtil;
