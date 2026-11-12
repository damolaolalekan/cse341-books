import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
  const db = getDb();
  return db.collection('books').find({}).toArray();
};

const getBookById = async (bookId) => {
  const db = getDb();
  return db.collection('books').findOne({ id: bookId });
};

const authorExists = async (authorId) => {
  const db = getDb();
  const author = await db.collection('authors').findOne({
    id: authorId
  });

  return author !== null;
};

const createBook = async (book) => {
  const db = getDb();
  await db.collection('books').insertOne(book);

  return book;
};

const updateBook = async (id, book) => {
  const db = getDb();

  return db.collection('books').updateOne(
    { id },
    { $set: book }
  );
};

const deleteBook = async (id) => {
  const db = getDb();

  return db.collection('books').deleteOne({ id });
};

export { getAllBooks, getBookById, authorExists, createBook, updateBook, deleteBook };
