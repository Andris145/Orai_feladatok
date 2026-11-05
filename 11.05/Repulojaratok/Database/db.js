import mysql from "mysql2/promise"

const config={
    host:"localhost",
    database:"jaratok",
    user:"root",
    password:"123",
    port:3306
}

const pool= mysql.createPool(config)

export default pool