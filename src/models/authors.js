
import { getDb } from '../db/connect.js';

const getAllAuthors = async () => {
  const db = getDb();
  return db.collection('authors').find({}).toArray();
};

const getAuthorById = async (id) => {
  const db = getDb();
  return db.collection('authors').findOne({ id });
};

const createAuthor = async (author) => {
  const db = getDb();
  await db.collection('authors').insertOne(author);

  return author;
};

const updateAuthor = async (id, author) => {
  const db = getDb();

  const result = await db.collection('authors').updateOne(
    { id },
    { $set: author }
  );

  return result;
};

const deleteAuthor = async (id) => {
  const db = getDb();

  return db.collection('authors').deleteOne({ id });
};

const authorHasBooks = async (id) => {
  const db = getDb();

  const count = await db.collection('books').countDocuments({
    authorId: id
  });

  return count > 0;
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks
};
