import express from "express";
const router = express.Router();

import { authUser, logoutUser, registerUser } from "../contorollers/userController";


router.route("/auth").post(authUser);
router.route("/register").post(registerUser);
router.route("/logout").post(logoutUser);

export default router;
