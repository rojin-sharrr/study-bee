import "reflect-metadata";
import { DataSource } from "typeorm";
import User from "./entities/user";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "your_database_name",
    synchronize: true,
    logging: true,
    entities: [User],
    subscribers: [],
    migrations: [],
}); 