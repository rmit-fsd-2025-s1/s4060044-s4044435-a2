import { AppDataSource } from "../data-source";
import { Application } from "../entity/Application";
import { Candidate } from "../entity/Candidate";
import { Comment } from "../entity/Comment";
import { Course } from "../entity/Course";
import { Lecturer } from "../entity/Lecturer";
import { LecturerCourse } from "../entity/LecturerCourse";
import { User } from "../entity/User";

// Repository instances to interact with the database
const courseRepo = AppDataSource.getRepository(Course);
const candidateRepo = AppDataSource.getRepository(Candidate);
const appRepo = AppDataSource.getRepository(Application);
const lecturerRepo = AppDataSource.getRepository(Lecturer);
const lecturerCourseRepo = AppDataSource.getRepository(LecturerCourse);
const userRepo = AppDataSource.getRepository(User);
const commentRepo = AppDataSource.getRepository(Comment);

export const resolvers = {
  Query: {

    
    /**
     * Fetch all available courses from the system.
     * Returns an array of course objects with their code and name.
     */
    allCourses: async () => {
      return await courseRepo.find();
    },

    // fetch all available lecturers

    allLecturers: async () => {
    return await lecturerRepo.find({ relations: ["user"] });
    },

    /**
     * For each course in the database, this returns a list of candidates who have applied.
     * Each candidate includes their user profile details.
     * This is useful for lecturers or admins to view applications per course.
     */
    candidatesPerCourse: async () => {
      const courses = await courseRepo.find();
      const result = [];

      for (const course of courses) {
        const applications = await appRepo.find({
          where: { course: { courseCode: course.courseCode } },
          relations: ["candidate", "candidate.user"]
        });
        const candidates = applications.map(app => app.candidate);
        result.push(candidates);
      }

      return result;
    },

    /**
     * Find candidates who have been selected or applied to more than 3 different courses.
     * This can help in identifying over-engaged applicants.
     */
    candidatesWithManySelections: async () => {
      const applications = await appRepo.find({ relations: ["candidate"] });
      const selectionCounts = new Map<number, number>();

      // Count how many times each candidate appears
      for (const app of applications) {
        const id = app.candidate?.candidateId;
        if (id) {
          selectionCounts.set(id, (selectionCounts.get(id) || 0) + 1);
        }
      }

      // Filter candidates with more than 3 selections
      const frequentCandidates = Array.from(selectionCounts.entries())
        .filter(([_, count]) => count > 3)
        .map(([id]) => id);

      return await candidateRepo.find({
        where: frequentCandidates.map(id => ({ candidateId: id })),
        relations: ["user"]
      });
    },

    /**
     * Retrieve candidates who have not been selected or associated with any course.
     * Helps identify applicants needing attention or follow-up.
     */
    candidatesWithNoSelections: async () => {
      const allCandidates = await candidateRepo.find({ relations: ["user"] });
      const selectedApplications = await appRepo.find({ relations: ["candidate"] });

      const selectedCandidateIds = new Set(
        selectedApplications.map(app => app.candidate?.candidateId)
      );

      // Return only those not in the selected set
      return allCandidates.filter(c => !selectedCandidateIds.has(c.candidateId));
    },

    /**
     * Admin report: List of selected candidates per course
     */
    selectedCandidatesPerCourse: async () => {
      const courses = await courseRepo.find();
      const result = [];

      for (const course of courses) {
        const selectedComments = await commentRepo.find({
          where: {
            course: { courseCode: course.courseCode },
            selected: true
          },
          relations: ["candidate", "candidate.user", "course"]
        });

        const candidates = selectedComments.map(comment => comment.candidate);
        result.push({ course, candidates });
      }

      return result;
    },

    /**
     * Admin report: Candidates selected for more than 3 courses
     */
    overSelectedCandidates: async () => {
      const selectedComments = await commentRepo.find({
        where: { selected: true },
        relations: ["candidate", "candidate.user", "course"]
      });

      const candidateCourseMap = new Map<number, Set<string>>();

      for (const comment of selectedComments) {
        const candidateId = comment.candidate?.candidateId;
        const courseCode = comment.course?.courseCode;

        if (candidateId && courseCode) {
          if (!candidateCourseMap.has(candidateId)) {
            candidateCourseMap.set(candidateId, new Set());
          }
          candidateCourseMap.get(candidateId)!.add(courseCode);
        }
      }

      const qualifiedCandidateIds = Array.from(candidateCourseMap.entries())
        .filter(([_, courseSet]) => courseSet.size > 3)
        .map(([candidateId]) => candidateId);

      return await candidateRepo.find({
        where: qualifiedCandidateIds.map(id => ({ candidateId: id })),
        relations: ["user"]
      });
    },

    /**
     * Admin report: Candidates not selected in any course
     */
    unselectedCandidates: async () => {
      const allCandidates = await candidateRepo.find({ relations: ["user"] });
      const selected = await commentRepo.find({
        where: { selected: true },
        relations: ["candidate"]
      });

      const selectedIds = new Set(selected.map(c => c.candidate?.candidateId));
      return allCandidates.filter(c => !selectedIds.has(c.candidateId));
    }
  },

  Mutation: {
    /**
     * Add a new course to the system with a given course code and name.
     * Prevents duplicates by courseCode at the database level.
     */
    addCourse: async (_: any, { courseCode, courseName }: { courseCode: string, courseName: string }) => {
      const course = courseRepo.create({ courseCode, courseName });
      return await courseRepo.save(course);
    },

    /**
     * Edit the name of an existing course based on its unique course code.
     * Returns the updated course object.
     */
    editCourse: async (_: any, { courseCode, courseName }: { courseCode: string, courseName: string }) => {
      await courseRepo.update(courseCode, { courseName });
      return await courseRepo.findOneBy({ courseCode });
    },

    /**
     * Permanently delete a course from the system using its course code.
     * Returns true if deletion is successful.
     */
    deleteCourse: async (_: any, { courseCode }: { courseCode: string }) => {
      const result = await courseRepo.delete(courseCode);
      return result.affected !== 0;
    },

    /**
     * Associate a lecturer with a specific course.
     * Useful for managing course responsibilities and access control.
     */
    assignLecturerToCourse: async (_: any, { lecturerId, courseCode }: { lecturerId: number, courseCode: string }) => {
      const lecturer = await lecturerRepo.findOneBy({ lecturerId });
      const course = await courseRepo.findOneBy({ courseCode });

      if (!lecturer || !course) {
        throw new Error("Lecturer or Course not found. Ensure both exist before assigning.");
      }

      const link = lecturerCourseRepo.create({ lecturer, course });
      return await lecturerCourseRepo.save(link);
    },

    /**
     * Temporarily disable a candidate's ability to log in or interact with the system.
     * This sets `isBlocked` to true in the associated User record.
     */
    blockCandidate: async (_: any, { candidateId }: { candidateId: number }) => {
      const candidate = await candidateRepo.findOne({
        where: { candidateId },
        relations: ["user"]
      });

      if (!candidate?.user) {
        throw new Error("Candidate not found or user relationship missing.");
      }

      candidate.user.isBlocked = true;
      await userRepo.save(candidate.user);
      return candidate;
    },

    /**
     * Re-enable a previously blocked candidate by setting `isBlocked` to false.
     */
    unblockCandidate: async (_: any, { candidateId }: { candidateId: number }) => {
      const candidate = await candidateRepo.findOne({
        where: { candidateId },
        relations: ["user"]
      });

      if (!candidate?.user) {
        throw new Error("Candidate not found or user relationship missing.");
      }

      candidate.user.isBlocked = false;
      await userRepo.save(candidate.user);
      return candidate;
    }
  }
};
