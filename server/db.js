import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    database: "TLdb",
    user: "TLuser",
    password: "1234",
    port: 3306,
    host: 'localhost'
});

export default pool;