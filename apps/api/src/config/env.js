import dotenv from "dotenv";

dotenv.config();

const env = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "super-secret-demo-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
};

export default env;
