import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  connectionString: process.env.CONNECTION_STRING as string,
  port: (process.env.PORT as string) || 3000,
};

export default config;
