import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = (req: Request, res:Response, next: NextFunction) => {
  console.log("Method - Url - Time:", req.method, req.url, Date.now());
  const logData = `Method : ${req.method} - Url: ${req.url} - Time: ${new Date().toISOString()}\n`;
  fs.appendFile("logger.txt", logData, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
  next();
}

export default logger;