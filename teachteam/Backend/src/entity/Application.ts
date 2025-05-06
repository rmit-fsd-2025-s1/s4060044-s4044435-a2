import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Candidate } from "./Candidate";
import { Course } from "./Course";

/**
 * Represents a tutor application submitted by a candidate for a specific course.
 */
@Entity()
export class Application {
  @PrimaryGeneratedColumn({ type: "int" })
  applicationId: number | undefined;

  @ManyToOne(() => Candidate)
  @JoinColumn()
  candidate: Candidate | undefined;

  @ManyToOne(() => Course)
  @JoinColumn()
  course: Course | undefined;

  @Column({ type: "varchar", length: 50 })
  roleType: string | undefined;

  @Column({ type: "varchar", length: 20 })
  availability: "full-time" | "part-time" | "casual" | undefined;

  @Column("simple-array")
  skills: string[] | undefined;

  @Column({ type: "text" })
  academicCredentials: string | undefined;
}
