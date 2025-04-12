import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/data-source";
import {
  EntityCourses,
  EntityUser,
  EntityAsset,
  EntityAssetCourse,
} from "./entities";
import userRoutes from "./routes/userRoutes";
import courseRoutes from "./routes/courseRoutes";
import cookieParser from "cookie-parser";


const PORT = process.env.PORT;

async function startApp() {
  const app = express();
  await connectDB();

  // Body-parser middleware:
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // const asset = await EntityAssetCourse.create({
  //   course_id: "<example course id>",
  //   asset_id: "<example asset id>"
  // }).save();



  app.get("/", (req, res) => {
    res.send(`API running `);
  });

  app.use("/api/users", userRoutes);
  app.use("/api/course", courseRoutes);


  app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
  });
}

startApp();
