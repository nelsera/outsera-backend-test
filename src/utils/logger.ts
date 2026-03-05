import pino from "pino";

const isProd = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

export const logger = pino({
  level: isTest ? "silent" : (process.env.LOG_LEVEL ?? (isProd ? "info" : "debug")),

  transport:
    isProd || isTest
      ? undefined
      : {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
            messageFormat: "{msg}",
            singleLine: true,
          },
        },
});
