
import {
  getAllAuthors as getAllAuthorsFromDb,
  getAuthorById as getAuthorByIdFromDb,
  createAuthor as createAuthorInDb,
  updateAuthor as updateAuthorInDb,
  deleteAuthor as deleteAuthorFromDb,
  authorHasBooks
} from '../models/authors.js';

const validName = (name) => {
  return typeof name === 'string' && name.trim().length > 0;
};

const validBirthYear = (year) => {
  return Number.isInteger(year)
    && year >= 1000
    && year <= new Date().getFullYear();
};

const getAllAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();
    return res.status(200).json(authors);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Unable to retrieve authors.'
    });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const author = await getAuthorByIdFromDb(req.params.id);

    if (!author) {
      return res.status(404).json({
        message: 'Author not found'
      });
    }

    return res.status(200).json(author);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Unable to retrieve author.'
    });
  }
};

const createAuthor = async (req, res) => {
  try {
    const { id, name, birthYear } = req.body ?? {};

    if (
      typeof id !== 'string'
      || !id.trim()
      || !validName(name)
      || !validBirthYear(birthYear)
    ) {
      return res.status(400).json({
        message: 'Valid id, name, and birthYear are required.'
      });
    }

    const existing = await getAuthorByIdFromDb(id);

    if (existing) {
      return res.status(400).json({
        message: 'Author ID already exists.'
      });
    }

    const author = {
      id,
      name: name.trim(),
      birthYear
    };

    await createAuthorInDb(author);

    return res.status(201).json(author);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Author ID already exists.'
      });
    }

    console.error(error);
    return res.status(500).json({
      message: 'Unable to create author.'
    });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { name, birthYear } = req.body ?? {};
    const { id } = req.params;

    if (!validName(name) || !validBirthYear(birthYear)) {
      return res.status(400).json({
        message: 'Valid name and birthYear are required.'
      });
    }

    const existing = await getAuthorByIdFromDb(id);

    if (!existing) {
      return res.status(404).json({
        message: 'Author not found'
      });
    }

    const updatedFields = {
      name: name.trim(),
      birthYear
    };

    const result = await updateAuthorInDb(id, updatedFields);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: 'Author not found'
      });
    }

    return res.status(200).json({
      id,
      ...updatedFields
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Unable to update author.'
    });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await getAuthorByIdFromDb(id);

    if (!existing) {
      return res.status(404).json({
        message: 'Author not found'
      });
    }

    const hasBooks = await authorHasBooks(id);

    if (hasBooks) {
      return res.status(409).json({
        message: 'Cannot delete an author who still has books.'
      });
    }

    const result = await deleteAuthorFromDb(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'Author not found'
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Unable to delete author.'
    });
  }
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
};
