import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

/**
 * Represents a system user — either a candidate or lecturer.
 */

@Entity()
export class User{
@PrimaryGeneratedColumn({type: "int"})
userId: number | undefined;

@Column({type:"varchar", length:40})
name: string | undefined;

@Column({ type: "varchar", length: 100, unique: true })
email: string | undefined;

@Column({ type: "varchar", length: 100 })
password: string | undefined;

@Column({ type: "varchar", length: 20 })
role: "candidate" | "lecturer" | "Admin" | undefined;

@Column({ type: "timestamp" })
joinedAt: Date | undefined;

@Column({ type: "boolean", default: false })
isBlocked: boolean | undefined;


}