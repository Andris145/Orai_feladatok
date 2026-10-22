import mysql from "mysql2/promise"

const dbconfig={
    host:"localhost",
    user:"root",
    database:"zenetar",
    port:3307
}

const pool = mysql.createPool(dbconfig)

export default pool