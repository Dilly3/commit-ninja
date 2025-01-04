import dotenv from "dotenv";

dotenv.config();
class Config {
  constructor(
      public port = process.env.PORT ?? "7020",
    public dbPort = parseInt(process.env.DB_PORT ?? "5436"),
    public dbHost = process.env.DB_HOST ?? "postgres",
    public dbUser = process.env.DB_USER ?? "postgres",
    public dbPassword = process.env.DB_PASSWORD ?? "postgres",
    public dbName = process.env.DB_NAME ?? "commit_ninja"
  ){}
}

export const config = new Config()
