import { Request, Response } from "express";
import { EntityUser } from "../entities";
import { ResponseHandler } from "../utils/response";
import generateToken from "../utils/generateToken";

// Getting database repository to perform CRUD operations(typeORM)
// const userRepository = AppDataSource.getRepository(EntityUser);

// @desc  :   Auth User and get Token
// @route :   POST /api/users/login
// @access:   Public
const authUser = async (req: Request, res: Response) => {
  const { email: userEmail, password: userPassword } = req.body;

  try {
    // Make sure the request contains both email and password.
    if (!userEmail || !userPassword) {
      throw new Error("Both email and Password are required.");
    }

    const user = await EntityUser.findOne({
      where: { email: userEmail },
    });

    if (user && user.password == userPassword) {
      // Keeping cookies after auth.
      generateToken(res, user.email);

      // Send response after setting cookie
      ResponseHandler.success({
        message: "Successfully auth user",
        res,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
        },
      });
    } else {
      throw new Error("Username or Password Incorrect");
    }
  } catch (error: any) {
    ResponseHandler.error({
      res,
      message: error.message || "Error Authnticating user",
    });
  }
};

// @desc  :   Regisrter User and log them in
// @route :   POST /api/users/register
// @access:   Public
const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, username, password } = req.body;

    // Check if the user exists:
    const emailExist = await EntityUser.findOne({
      where: { email: email },
    });

    if (emailExist) {
      throw new Error("The email already exists");
    }

    // Create new User
    const user = await EntityUser.create({
      name,
      email,
      username,
      password,
    }).save();

    // Send back Response
    ResponseHandler.success({
      message: "User registered succesfully",
      data: user,
      statusCode: 200,
      res,
    });
  } catch (error: any) {
    ResponseHandler.error({
      res,
      message: error.message || "Error occurred while registering an user.",
    });
  }
};

// @desc  :   Logout User
// @route :   POST /api/users/logout
// @access:   Private: to logged in User
const logoutUser = async (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  ResponseHandler.success({
    message: "User logged out successfully",
    res,
  });
};

export { authUser, registerUser, logoutUser };
