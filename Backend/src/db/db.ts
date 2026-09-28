import pg from "pg";
import dotenv from "dotenv"
dotenv.config();

const {Pool} = pg;

const pool = new Pool({
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    host : process.env.DB_HOST,
    port : Number(process.env.DB_PORT),
    database : process.env.DB_NAME
});

const connectDB = async ()=>{
    try {
       const con = await pool.connect();
       console.log("🐘 PostgreSQL Database successfully connected!");
       con.release()
    } catch (error) {
        console.log("PostgreSQL DB Connection Failed!" , error)
        process.exit(1);
    }
}

export default pool;