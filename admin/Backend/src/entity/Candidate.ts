import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

/**
 * Represents a candidate profile linked to a User.
 */

@Entity()
export class Candidate {
  @PrimaryGeneratedColumn({ type: "int" })
  candidateId: number | undefined;

  @OneToOne(() => User)
  @JoinColumn({name: "candidateId"})
  user: User | undefined;
}
