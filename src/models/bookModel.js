// Dummy model using raw SQL or any DB abstraction layer

import mysql from 'mysql2/promise'; // or use your DB connector

const pool = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'debasish7896',
  database: 'myappdb',
});

export const findAllBooks = async () => {
  const [rows] = await pool.query('SELECT * FROM book');
  return rows;
};

export const findBookByName = async (name) => {
  const [rows] = await pool.query('SELECT * FROM myappdb.book WHERE SOUNDEX(title) = SOUNDEX(?)', [name]);
  console.log("Inside")
  return rows;
};

export const findBookByUserID = async (userID) => {
  const [rows] = await pool.query('SELECT * FROM myappdb.book WHERE seller_id= ?', [userID]);
  console.log("Inside")
  return rows;
};


export const saveBookToDB = async (title, author, category, price, sellerid, image) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO book (title, author, category, price, seller_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [title, author, category, price, sellerid, image]
    );

    console.log("Insert result:", result); // ← Confirm insert happened

    return {
      id: result.insertId,
      title,
      author,
      category,
      price,
      sellerid,
      image
    };
  } catch (error) {
    console.error("DB Insert Error:", error); // ← Catch silent failures
    throw error;
  }
};