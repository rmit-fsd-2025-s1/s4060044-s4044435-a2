import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '209.38.26.237',
  port: 3306,
  username: 'S4060044',
  password: 'Password1',
  database: 'S4060044',
  synchronize: true,
  logging: false,
  migrations: [],
  subscribers: [],
});
