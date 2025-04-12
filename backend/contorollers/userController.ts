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

  // Make sure the request contains both email and password.
  if (!userEmail || !userPassword) {
    ResponseHandler.badRequest(
      res,
      "Both email and password must be provided for auth"
    );
  }

  //TODO: Ask Nishan dai: how can I implement the repository and why was that error comming

  const user = await EntityUser.findOne({
    where: { email: userEmail },
  });


  if (user && user.password == userPassword) {
    // Keeping cookies after auth.
    generateToken(res, user.email);

    return ResponseHandler.success({
      message: "Succesfully auth user",
      res,
      data: user,
    });
  } else {
    return ResponseHandler.unauthorized(res, "Username or password incorrect");
  }
};

// @desc  :   Regisrter User and log them in
// @route :   POST /api/users/register
// @access:   Public
const registerUser = async (req: Request, res: Response) => {

  const { name, email, username, password } = req.body;

  // Check if the user exists:
  const emailExist = await EntityUser.findOne({
    where: {email: email}
  })

  if (emailExist){
    return ResponseHandler.badRequest(res, "Bad request: User already exists")
  }

  // Create new User
  const user = await EntityUser.create({
    name,
    email,
    username,
    password,
  }).save();

  // Send back Response
  return ResponseHandler.success({
    message: "User registered succesfully",
    data: user,
    statusCode: 200,
    res,
  })  

}

// @desc  :   Logout User
// @route :   POST /api/users/logout
// @access:   Private: to logged in User
const logoutUser = async (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return ResponseHandler.success({
    message: "User logged out successfully",
    res,
  })
} 



export { authUser, registerUser, logoutUser };
