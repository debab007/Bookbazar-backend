import { getAllBooks, getBookByName, saveBook , getBookByUserID} from '../services/bookService.js';

export const fetchBooks = async (req, res) => {
  const books = await getAllBooks();
  res.json(books);
};

export const fetchBook = async (req, res) => {
  const name = req.query.nameofbook;
  if (!name) return res.status(400).json({ error: 'Book name is required' });console.log("Inside fetchbook")

  const book = await getBookByName(name);
  if (!book) return res.status(404).json({ error: 'Book not found' });

  res.json(book);
};

export const myBooks = async (req, res) => {
  const userID = req.query.userID;
  if (!userID) return res.status(400).json({ error: 'Book name is required' });console.log("Inside fetchbook")

  const books = await getBookByUserID(userID);
  if (!books) return res.status(404).json({ error: 'Books not found' });

  res.json(books);
};


  export const uploadBookImage = async (req, res) => {
    try {
      const { title, author, category, price, sellerid } = req.body;
      const image = req.file?.filename;
  
      console.log("Received:", { title, author, category, price, sellerid, image });
  
      const savedBook = await saveBook(title, author, category, price, sellerid, image);
  
      console.log("Saved to DB:", savedBook);
  
      res.status(201).json({ message: 'Book uploaded', book: savedBook });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  