
// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';

// dotenv.config(); // load environment variables

// const sequelize = new Sequelize(
//   process.env.MYSQL_DATABASE,
//   process.env.MYSQL_USER,
//   process.env.MYSQL_PASSWORD,
//   {
//     host: process.env.MYSQL_HOST || 'localhost',
//     dialect: 'mysql',
//     logging: false,
//   }
// );


import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config(); // This must come before using any env variables
import fs from "fs";

// console.log("Looking for .env file...");
// console.log(".env exists?", fs.existsSync(".env"));

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

export default sequelize;
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
