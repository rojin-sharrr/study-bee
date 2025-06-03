import "reflect-metadata"; // Required for TypeORM
import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import AllEntities from "../entities";
import dotenv from 'dotenv';

// DataSource Object: It is a database connection Configuration. It enables us to configure to the database .
// const AppDataSource = new DataSource({
//   type: "postgres",
//   host: "localhost",
//   port: 5432,
//   username: "postgres",
//   password: "4522",
//   database: "study-bee",
//   synchronize: true, // Automatically creates tables
//   logging: false,
//   entities: AllEntities, // Use the array of entities directly
// } as PostgresConnectionOptions);

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "4522",
  database: process.env.DB_NAME || "study-bee",
  synchronize: true,
  logging: false,
  entities: AllEntities,
} as PostgresConnectionOptions);


// Connect to the database
// const connectDB = async () => {
//   try {
//     const connection = await AppDataSource.initialize();
//     console.log(
//       `Database Connection to Database \"${
//         connection.options.database
//       }\" at port \"${
//         (connection.options as PostgresConnectionOptions).port
//       }\"`
//     );
//     return connection;
//   } catch (error) {
//     console.error("Database connection error:", error);
//     throw error;
//   }
// };

const connectDB = async (retries = 5, delay = 3000) => {
  while (retries > 0) {
    try {
      const connection = await AppDataSource.initialize();
      console.log(`Connected to DB: ${connection.options.database}`);
      return connection;
    } catch (err) {
      console.error("❌ DB connection failed, retrying in 3s...");
      retries--;
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error("❌ Failed to connect to the database after retries.");
};


export default connectDB;
export { AppDataSource };
