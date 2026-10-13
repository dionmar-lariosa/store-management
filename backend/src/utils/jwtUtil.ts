import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

const JwtUtil = {
  generateToken: () => {
    return jwt.sign(
      {
        role: "owner"
      },
      JWT_SECRET,
      {
        expiresIn: "2h"
      }
    );
  },

  verifyToken: (token: string) => {
    return jwt.verify(token, JWT_SECRET);
  }
};

export default JwtUtil;
