import { findAllBooks, findBookByName, findBookByUserID, saveBookToDB } from '../models/bookModel.js';


export const getAllBooks = async () => {
  return await findAllBooks();
};

export const getBookByName = async (name) => {
  return await findBookByName(name);
};

export const getBookByUserID = async (UserID) => {
  return await findBookByUserID(UserID);
};


export const saveBook = async ( title, author, category, price, sellerid, image ) => {
  return await saveBookToDB(title, author, category, price,sellerid, image);
};
