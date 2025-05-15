import mysql from 'mysql2'

const pool = await mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'debasish7896',
  database: 'myappdb',
}).promise(); // adjust path to your db connection

export const placeOrder = async (req, res) => {
  const { userId, bookIds } = req.body;

  try {
    // Fetch prices and check availability
    const [books] = await pool.query(
      `SELECT id, price, status FROM book WHERE id IN (?)`,
      [bookIds]
    );

    // Check if any book is sold
    const unavailable = books.find(book => book.status !== 'available');
    if (unavailable) {
      return res.status(400).json({ message: `Book with ID ${unavailable.id} is not available.` });
    }

    const totalPrice = books.reduce((sum, b) => sum + parseFloat(b.price), 0);

    // Insert into orders table
    const [orderResult] = await pool.query(
      `INSERT INTO orders (user_id, total_price) VALUES (?, ?)`,
      [userId, totalPrice]
    );

    const orderId = orderResult.insertId;

    // Insert into order_items and update book status
    for (let book of books) {
      await pool.query(
        `INSERT INTO order_items (order_id, book_id, price) VALUES (?, ?, ?)`,
        [orderId, book.id, book.price]
      );

      await pool.query(
        `UPDATE book SET status = 'sold' WHERE id = ?`,
        [book.id]
      );
    }

    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

export const getUserOrders = async (req, res) => {
  const userId = req.params.userId;

  try {
    const [orders] = await pool.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    for (let order of orders) {
      const [items] = await pool.query(
        `SELECT b.title,b.id, oi.price FROM order_items oi
         JOIN book b ON b.id = oi.book_id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not retrieve orders.' });
  }
};

// GET /api/orders/seller/:sellerId
export const getSellerOrders = async (req, res) => {
  const sellerId = req.params.sellerId;

  try {
    const [orders] = await pool.query(
      `SELECT o.id AS order_id, o.total_price, o.status, o.created_at, b.title, u.name AS buyer_name
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN book b ON oi.book_id = b.id
       JOIN users u ON o.user_id = u.id
       WHERE b.seller_id = ?
       ORDER BY o.created_at DESC`,
      [sellerId]
    );

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching seller orders' });
  }
};

// PUT /api/orders/:orderId/status
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body; // 'accepted' or 'rejected'

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    await pool.query(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, orderId]
    );
    res.status(200).json({ message: `Order ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};
