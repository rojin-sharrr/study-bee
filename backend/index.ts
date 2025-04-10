import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/data-source";
import { EntityCourses, EntityUser } from "./entities";


const PORT = process.env.PORT;

async function startApp() {
  const app = express();
  await connectDB();
  
  await EntityUser.create({
    name: "niaodoasnd",
    password: "asdasd",
    email: "adasdasd",
    username:"asdasdasd"
  }).save();

  EntityCourses.create({
    name: "Physics",
    description: "This is an example course"
  })


  app.get("/", (req, res) => {
    res.send(`API running `);
  });

  app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
  });
}
startApp();
