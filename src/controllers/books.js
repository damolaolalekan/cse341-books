
import {
  getAllBooks,
  getBookById,
  authorExists,
  createBook,
  updateBook,
  deleteBook
} from '../models/books.js';

const validText = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

const validDate = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime())
    && date.toISOString().slice(0, 10) === value;
};

const validBookFields = (book) => {
  return validText(book.authorId)
    && validText(book.title)
    && validDate(book.publicationDate);
};

const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();

    return res.status(200).json(books);
  } catch (error) {
    console.error('GET /books failed:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const getBookByIdHandler = async (req, res) => {
  try {
    const book = await getBookById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('GET /books/:id failed:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const createBookHandler = async (req, res) => {
  try {
    const { id, authorId, title, publicationDate } = req.body ?? {};

    const book = {
      id,
      authorId,
      title,
      publicationDate
    };

    if (!validText(id) || !validBookFields(book)) {
      return res.status(400).json({
        message: 'Valid id, authorId, title, and publicationDate are required.'
      });
    }

    const existingBook = await getBookById(id);

    if (existingBook) {
      return res.status(400).json({
        message: 'Book ID already exists.'
      });
    }

    if (!(await authorExists(authorId))) {
      return res.status(400).json({
        message: 'Author ID does not exist.'
      });
    }

    await createBook(book);

    return res.status(201).json(book);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Book ID already exists.'
      });
    }

    console.error('POST /books failed:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const updateBookHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { authorId, title, publicationDate } = req.body ?? {};

    const book = {
      authorId,
      title,
      publicationDate
    };

    if (!validBookFields(book)) {
      return res.status(400).json({
        message: 'Valid authorId, title, and publicationDate are required.'
      });
    }

    const existingBook = await getBookById(id);

    if (!existingBook) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    if (!(await authorExists(authorId))) {
      return res.status(400).json({
        message: 'Author ID does not exist.'
      });
    }

    const result = await updateBook(id, book);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    return res.status(200).json({
      id,
      ...book
    });
  } catch (error) {
    console.error('PUT /books/:id failed:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const deleteBookHandler = async (req, res) => {
  try {
    const result = await deleteBook(req.params.id);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('DELETE /books/:id failed:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler
};
