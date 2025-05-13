import mysql from 'mysql2/promise'; // or use your DB connector

const pool = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'debasish7896',
  database: 'myappdb',
});

const createUser = async (name, email, hashedPassword) => {
  console.log("inside")
  await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
};

const findUserByEmail = async (email) => {
  console.log("inside login")
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

export { createUser, findUserByEmail };
