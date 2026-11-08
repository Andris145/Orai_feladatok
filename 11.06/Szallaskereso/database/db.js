import mysql from "mysql2/promise"

const dbconfig={
    host:"localhost",
    database:"szallasok",
    user:"root",
    password:"123",
    port:3306
};

const pool = mysql.createPool(dbconfig);
export default pool;