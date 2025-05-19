import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Lecturer } from "./Lecturer";
import { Candidate } from "./Candidate";
import { Course } from "./Course";

/**
 * Represents a comment and ranking made by a lecturer on a candidate for a course.
 */
@Entity()
export class Comment {
  @PrimaryGeneratedColumn({ type: "int" })
  commentId: number | undefined;

  @ManyToOne(() => Lecturer)
  @JoinColumn()
  lecturer: Lecturer | undefined;

  @ManyToOne(() => Candidate)
  @JoinColumn()
  candidate: Candidate | undefined;

  @ManyToOne(() => Course)
  @JoinColumn()
  course: Course | undefined;

  @Column({ type: "text" })
  comment: string | undefined;

  @Column({ type: "int" })
  rank: number | undefined;

  @Column({type: "boolean", default: false})
  selected: boolean| undefined
}
