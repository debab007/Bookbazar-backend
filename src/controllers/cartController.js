import mysql from 'mysql2/promise'; // or use your DB connector

const pool = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'debasish7896',
  database: 'myappdb',
}); // Your MySQL connection module

// ✅ Add to Cart
export const addToCart = async (req, res) => {
  const { userId, bookId, quantity } = req.body;

  try {
    // Check if book is already in cart
    const [existing] = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND book_id = ?',
      [userId, bookId]
    );

    if (existing.length > 0) {
      // Update quantity
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND book_id = ?',
        [quantity, userId, bookId]
      );
      return res.json({ message: 'Cart updated successfully.' });
    }

    // Insert new item
    await pool.query(
      'INSERT INTO cart_items (user_id, book_id, quantity) VALUES (?, ?, ?)',
      [userId, bookId, quantity]
    );

    res.status(201).json({ message: 'Item added to cart.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// 📋 View Cart
export const viewCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT c.book_id, b.title, b.price, b.image_url, c.quantity
       FROM cart_items c
       JOIN book b ON c.book_id = b.id
       WHERE c.user_id = ?`,
      [userId]
    );

    res.json({ cart: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ❌ Remove from Cart
export const removeFromCart = async (req, res) => {
  const { userId, bookId } = req.body;

  try {
    await pool.query(
      'DELETE FROM cart_items WHERE user_id = ? AND book_id = ?',
      [userId, bookId]
    );

    res.json({ message: 'Item removed from cart.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};
