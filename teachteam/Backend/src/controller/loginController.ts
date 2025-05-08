import { Request,Response } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export const login = async(req:Request, res:Response):Promise<any> => {
    const {email,password} = req.body;
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Comparing the password user entered and actual using bcrypt
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  

// If no match, reject login
if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }



  // Creating JWT token for frontend to authenticate user for further requests
  const token = jwt.sign(
    {email:user.email, role: user.role ,password: user.password, joinedAt:user.joinedAt,name:user.name}, // Payload
    "secretkey123", // secret key
    {expiresIn: "1h"} // Token options
  )

  // Return user with welcome message, user and token
  return res.json({ message: `Welcome ${user.name}`, user, token});
}