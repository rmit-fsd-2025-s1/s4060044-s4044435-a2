import { Entity, PrimaryColumn, Column } from "typeorm";

/**
 * Represents a course with a code and name.
 */
@Entity()
export class Course {
  @PrimaryColumn({ type: "varchar", length: 10 })
  courseCode: string | undefined;

  @Column({ type: "varchar", length: 100 })
  courseName: string | undefined;
}
