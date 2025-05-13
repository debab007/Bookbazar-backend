import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

            

const pool= mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getbooks() {
    
    const [result]=await pool.query("SELECT id, title, author, category, price FROM myappdb.book")
    return result
}

export async function getbook(nameofboook){
    const [result] = await pool.query(
        
        'SELECT id, title, author, category, price FROM myappdb.Book WHERE SOUNDEX(title) = SOUNDEX(?)',     //Use SOUNDEX() for Phonetic Matching
        [nameofboook]
    )
    return result
}




