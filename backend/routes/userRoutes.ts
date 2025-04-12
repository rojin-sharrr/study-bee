import express from "express";
const router = express.Router();

import { authUser, registerUser } from "../contorollers/userController";


router.route("/auth").post(authUser);
router.route("/register").post(registerUser);

export default router;
