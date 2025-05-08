import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from "./entity/User";
import { Candidate } from "./entity/Candidate";
import { Lecturer } from "./entity/Lecturer";
import { Application } from "./entity/Application";
import { Course } from "./entity/Course";
import { LecturerCourse } from "./entity/LecturerCourse";
import { Comment } from "./entity/Comment";


export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '209.38.26.237',
  port: 3306,
  username: 'S4060044',
  password: 'Password1',
  database: 'S4060044',
  synchronize: true,
  logging: false,
  entities: [User,Candidate,Lecturer,Application,Course,LecturerCourse,Comment],
  migrations: [],
  subscribers: [],
});
