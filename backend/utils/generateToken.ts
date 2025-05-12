import jwt from "jsonwebtoken";
import  { Response } from "express";


 const generateToken = ( res: Response, email: string | null ) =>{

    const token = jwt.sign( {email}, process.env.JWT_SECRET || 'default-secret-key', {
        expiresIn: "30d"
    } )

    // Set JWT to HTTP-Only cookie:
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,  // Required for SameSite: None
        sameSite: 'none',  // Required for cross-site cookies
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days
        path: '/',
        domain: 'localhost'  // Specify domain
    });
}

export default generateToken;