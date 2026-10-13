import { configDotenv } from "dotenv";
import express from "express";
import helmet from "helmet";
import routes from "./routes/index.js";
import ErrorMiddleware from "./middleware/errorMiddleware.js";
import Constant from "./constants.js";
import LoggerMiddleware from "./middleware/loggerMiddleware.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/openapi.js";

configDotenv({
  path: `.env.${process.env.NODE_ENV ?? "development"}`,
  debug: process.env.IS_DEBUG === "true"
});
const app = express();

// Security headers
app.use(helmet());

// Logger
app.use(LoggerMiddleware);

// Parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      docExpansion: "none"
    }
  })
);

// API'S
app.use("/api/", routes);
app.get("/api", (req, res) => {
  res.json({
    message: Constant.LOG_MESSAGES.SERVER_HEALTH_CHECK
  });
});

// Error Handler
app.use(ErrorMiddleware.notFoundHandler);
app.use(ErrorMiddleware.errorHandler);

export default app;
