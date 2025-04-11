import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/data-source";
import { EntityCourses, EntityUser, EntityAsset, EntityAssetCourse } from "./entities";

const PORT = process.env.PORT;

async function startApp() {
  const app = express();
  await connectDB();

  // const asset = await EntityAssetCourse.create({
  //   course_id: "<example course id>",
  //   asset_id: "<example asset id>"
  // }).save();

  app.get("/", (req, res) => {
    res.send(`API running `);
  });

  app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
  });
}

startApp();
