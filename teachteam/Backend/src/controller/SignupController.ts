import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs"

export const signUp  = async(req:Request,res:Response): Promise<any> => {
    const {name,email,password,role} = req.body

  // Basic validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const userRepo = AppDataSource.getRepository(User);

  // Check if user already exists
  const existing = await userRepo.findOneBy({ email });
  if (existing) {
    return res.status(409).json({ error: "Email already in use" });
  }

  // Using bcrypt to hash my password and then compare it in my login controller
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create and save new user
  const user = userRepo.create({
    name,
    email,
    password:hashedPassword,
    role,
    joinedAt: new Date()
  });

  const saved = await userRepo.save(user);
  return res.status(201).json(saved);
};


