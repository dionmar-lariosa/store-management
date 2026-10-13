import { pinoHttp } from "pino-http";

const LoggerMiddleware = pinoHttp({
  autoLogging: false,
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url
      };
    }
  },
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname"
          }
        }
      : undefined
});

export default LoggerMiddleware;
