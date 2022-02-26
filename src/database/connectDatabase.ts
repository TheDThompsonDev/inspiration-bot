import { connect } from "mongoose";

import { errorHandler } from "../utils/errorHandler";
import { logHandler } from "../utils/logHandler";

/**
 * Module to instantiate the database connection.
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await connect(process.env.MONGO_URI as string);
    logHandler.log("debug", "Connected to database.");
  } catch (err) {
    errorHandler("connectDatabase", err);
  }
};
