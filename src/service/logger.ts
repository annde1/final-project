import winston from "winston";
//Winston logger setup
const { createLogger, transports } = winston;

const errorTransport = new transports.File({
  filename: "error.log",
  level: "error",
});
const infoTransport = new transports.File({
  filename: "info.log",
  level: "info",
});

export const logger = createLogger({
  transports: [errorTransport, infoTransport, new winston.transports.Console()],
});
