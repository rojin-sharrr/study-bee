import jwt from "jsonwebtoken";
import { EntityUser } from "../entities";
import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../utils/response";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: EntityUser;
    }
  }
}

//For Protect routes: checks and verifies the jwt tokens(for users who have logged in and have not logged out)
const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  token = req.cookies.jwt; 
  

  if (!token ) {
    ResponseHandler.unauthorized(res, "Not Authorized: No token found")
  }

  try {
        // decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {email: string}
    
        // Find user from using decoded token
        const user = await EntityUser.findOne({
            where: {email: decoded.email }
        });

        if (!user){
            ResponseHandler.unauthorized(res, "Not Authorized: User not found")
            return
        }
         // Attach the request with the user( fetched from token)
        req.user = user;
        next();
    
  } catch (error) {
    ResponseHandler.unauthorized(res, "Not Authorized: Token failed")
  }
  };

export default protect;
