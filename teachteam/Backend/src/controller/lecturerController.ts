import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { LecturerCourse } from "../entity/LecturerCourse";
import jwt from "jsonwebtoken";
import { Application } from "../entity/Application";
import { Comment } from "../entity/Comment";
import { Lecturer } from "../entity/Lecturer";
import { Candidate } from "../entity/Candidate";
import { Course } from "../entity/Course";

// This controller handles both GET and POST request for lecturer page
export const lecturer = async (req: Request, res: Response): Promise<any> => {
  // Extracting JWT token from Authorization header
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    let decode: any;
    // Decoding snd verifying the token
    try {
      decode = jwt.verify(token, "secretkey123");
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Getting user based on email from the decoded token
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email: decode.email });

    // User checks:- If user exists and he is a lecturer
    if (!user || user?.role?.toLowerCase() !== "lecturer") {
      return res.status(403).json({ error: "User has no access" });
    }

    // Initializing all the required repos
    const lecturerRepo = AppDataSource.getRepository(Lecturer);
    const candidateRepo = AppDataSource.getRepository(Candidate);
    const courseRepo = AppDataSource.getRepository(Course);
    const commentRepo = AppDataSource.getRepository(Comment);
    const applicationRepo = AppDataSource.getRepository(Application);
    const lecturerCourseRepo = AppDataSource.getRepository(LecturerCourse);

    // Handle POST request
    if (req.method === "POST") {
      // Destructure required fields from request body
      const { candidateId, courseCode, comment, rank, selected } = req.body;
      // Validate required fields
      if (!candidateId || !courseCode || selected === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Finding the lecturer by the matching email
      const lecturer = await lecturerRepo.findOne({
        where: { user: { email: decode.email } },
        relations: ["user"],
      });
      // Finding the candidate and course
      const candidate = await candidateRepo.findOne({
        where: { candidateId },
        relations: ["user"],
      });

      const course = await courseRepo.findOneBy({ courseCode });

      // Check if any required field is missing
      if (!lecturer || !candidate || !course) {
        return res
          .status(404)
          .json({ error: "Lecturer, candidate, or course not found" });
      }

      // Try to find existing comment record
      let commentEntity = await commentRepo.findOne({
        where: {
          lecturer: { user: { email: decode.email } },
          candidate: { candidateId: candidate.candidateId },
          course: { courseCode: course.courseCode },
        },
        relations: ["lecturer", "candidate", "course", "lecturer.user"],
      });

      if (commentEntity) {
        // Updating the existing comment
        commentEntity.comment = comment;
        commentEntity.rank = rank;
      } else {
        // Create a new comment entry
        commentEntity = commentRepo.create({
          lecturer,
          candidate,
          course,
          comment,
          rank,
          selected,
        });
      }
      // Save the comment (new or updated)
      await commentRepo.save(commentEntity);
      return res.status(200).json({ message: "Comment saved successfully" });
    }

    // Handle GET request

    // Fetch all courses assigned to the lecturer by the admin
    const assigned = await lecturerCourseRepo.find({
      relations: ["lecturer", "course", "lecturer.user"],
      where: { lecturer: { user: { email: decode.email } } },
    });

    const details = [];

    // Loop through each course assigned to the lecturer
    for (const assign of assigned) {
      const course = assign.course;
      if (!course) continue;

      // Get all applications for this course

      const applications = await applicationRepo.find({
        relations: ["candidate", "candidate.user", "course"],
        where: { course: { courseCode: course.courseCode } },
      });
      // Format application details along with saved comments (if any)
      const formattedApplications = await Promise.all(
        applications.map(async (app) => {
          const savedComment = await commentRepo.findOne({
            where: {
              lecturer: { user: { email: decode.email } },
              candidate: { candidateId: app.candidate?.candidateId },
              course: { courseCode: course.courseCode },
            },
            relations: ["lecturer", "candidate", "course", "lecturer.user"],
          });

          return {
            applicationId: app.applicationId,
            candidateId: app.candidate?.candidateId,
            candidateName: app.candidate?.user?.name,
            email: app.candidate?.user?.email,
            roleType: app.roleType,
            availability: app.availability,
            skills: app.skills,
            academicCredentials: app.academicCredentials,
            prevWork: app.prevWork,
            comment: savedComment?.comment || "",
            rank: savedComment?.rank || null,
            selected: savedComment?.selected || false,
          };
        })
      );
      // Push course info along with formatted applications
      details.push({
        courseCode: course.courseCode,
        courseName: course.courseName,
        applications: formattedApplications,
      });
    }
    // Send the lecturer name and course-application data
    return res.status(200).json({ lecturer: user.name, courses: details });
  } catch (err) {
    console.error("Error in getLecturerCourses:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
