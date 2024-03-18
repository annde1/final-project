import mongoose from "mongoose";
import { logger } from "../service/logger";
const connect = async () => {
  try {
    const connectionStr = process.env.CONNECTION_STRING!;
    if (!connectionStr) {
      throw new Error("CONNECTION_STRING is not defined in .env file");
    }
    await mongoose.connect(connectionStr);
    logger.info("Database connected"); //winston logger
  } catch (err) {
    console.log(err);
    logger.error(err);
  }
};
export { connect };
