import mysql from "mysql2/promise"

const dbconfig={
    host:"localhost",
    database:"szallasok",
    user:"root",
    password:"",
    port:3307
};

const pool = mysql.createPool(dbconfig);
export default pool;