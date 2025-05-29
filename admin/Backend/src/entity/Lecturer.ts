import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

/**
 * Represents a lecturer profile linked to a User.
 */
@Entity()
export class Lecturer {
  @PrimaryGeneratedColumn({ type: "int" })
  lecturerId: number | undefined;

  @OneToOne(() => User)
  @JoinColumn({name: "lecturerId"})
  user: User | undefined;
}
