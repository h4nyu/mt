import winston from "winston";

export const Logger = (props?: { level?: string }) => {
  return winston.createLogger({
    level: props?.level || "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "app.log" }),
    ],
  });
};
