import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Candidate } from "../entity/Candidate";
import { Course } from "../entity/Course";
import { Application } from "../entity/Application";
import { User } from "../entity/User";
import jwt from "jsonwebtoken";

export const candidate = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decode: any = jwt.verify(token, "secretkey123");

const userRepo = AppDataSource.getRepository(User);
const user = await userRepo.findOneBy({ email: decode.email });

if (!user || user?.role?.toLowerCase() !== "tutor") {
  return res.status(403).json({ error: "Access denied. Not a tutor." });
}
const candidateRepo = AppDataSource.getRepository(Candidate);
const candidate = await candidateRepo.findOne({
  where: { user: { email: decode.email } },
  relations: ["user"]
});


    
    const courseRepo = AppDataSource.getRepository(Course);
    const applicationRepo = AppDataSource.getRepository(Application);

    if (req.method === "GET") {
      const courses = await courseRepo.find();
      return res.status(200).json({ name: user.name, courses });
    }

    if (req.method === "POST") {
      const {
        roleType,
        availability,
        skills,
        academicCredentials,
        prevWork,
        courseCode
      } = req.body;

      if (!courseCode || !roleType || !availability) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const candidate = await candidateRepo.findOne({
        where: { user: { email: decode.email } },
        relations: ["user"]
      });

      const course = await courseRepo.findOneBy({ courseCode });
      if (!candidate || !course) {
        return res.status(404).json({ error: "Candidate or course not found" });
      }

      const existingApp = await applicationRepo.findOne({
        where: {
          candidate: { candidateId: candidate.candidateId },
          course: { courseCode: course.courseCode }
        },
        relations: ["candidate", "course"]
      });

      if (existingApp) {
        return res.status(409).json({ error: "Application already submitted for this course" });
      }

      const newApp = applicationRepo.create({
        roleType,
        availability,
        skills,
        academicCredentials,
        prevWork,
        candidate,
        course
      });

      await applicationRepo.save(newApp);
      return res.status(201).json({ message: "Application submitted successfully" });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (err) {
    console.error("Error in candidate controller:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};