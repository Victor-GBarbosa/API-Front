import dotenv from "dotenv";
dotenv.config();

const apiUrl = process.env.APIURL;

console.log(apiUrl);

export { apiUrl };
