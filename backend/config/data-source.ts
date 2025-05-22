import "reflect-metadata"; // Required for TypeORM
import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import AllEntities from "../entities";

// DataSource Object: It is a database connection Configuration. It enables us to configure to the database .
const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "4522",
  database: "study-bee",
  synchronize: true, // Automatically creates tables
  logging: false,
  entities: AllEntities, // Use the array of entities directly
} as PostgresConnectionOptions);

// Connect to the database
const connectDB = async () => {
  try {
    const connection = await AppDataSource.initialize();
    console.log(
      `Database Connection to Database \"${
        connection.options.database
      }\" at port \"${
        (connection.options as PostgresConnectionOptions).port
      }\"`
    );
    return connection;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

export default connectDB;
export { AppDataSource };
