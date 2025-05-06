import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Lecturer } from "./Lecturer";
import { Course } from "./Course";

/**
 * Represents the relationship between a lecturer and a course.
 */
@Entity()
export class LecturerCourse {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number | undefined;

  @ManyToOne(() => Lecturer)
  @JoinColumn()
  lecturer: Lecturer | undefined;

  @ManyToOne(() => Course)
  @JoinColumn()
  course: Course | undefined;
}
