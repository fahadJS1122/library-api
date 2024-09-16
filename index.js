// index.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { users, books, borrowers } = require('./data');

const app = express();
const port = 3000;


const mongoURI = 'mongodb://localhost:27017/library'; 
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.json());

// Get all users
app.get('/users', (req, res) => {
  res.json(users);
});

// Get a specific user by ID
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Create a new user
app.post('/users', (req, res) => {
  const newUser = req.body;
  if (!newUser.name) {
    return res.status(400).json({ error: 'User name is required' });
  }
  newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update an existing user
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;
  let user = users.find(u => u.id === userId);
  if (user) {
    user = { ...user, ...updatedUser };
    users[users.findIndex(u => u.id === userId)] = user;
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Delete a user
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users.splice(index, 1);
    // Also remove any borrowing records related to this user
    const borrowedBooks = borrowers.filter(b => b.userId === userId);
    borrowedBooks.forEach(b => {
      borrowers.splice(borrowers.indexOf(b), 1);
    });
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Get all books
app.get('/books', (req, res) => {
  res.json(books);
});

// Get a specific book by ID
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

// Create a new book
app.post('/books', (req, res) => {
  const newBook = req.body;
  if (!newBook.title || !newBook.author) {
    return res.status(400).json({ error: 'Book title and author are required' });
  }
  newBook.id = books.length ? books[books.length - 1].id + 1 : 1;
  books.push(newBook);
  res.status(201).json(newBook);
});

// Update an existing book
app.put('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const updatedBook = req.body;
  let book = books.find(b => b.id === bookId);
  if (book) {
    book = { ...book, ...updatedBook };
    books[books.findIndex(b => b.id === bookId)] = book;
    res.json(book);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

// Delete a book
app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    // Also remove any borrowing records related to this book
    const borrowedRecords = borrowers.filter(b => b.bookId === bookId);
    borrowedRecords.forEach(b => {
      borrowers.splice(borrowers.indexOf(b), 1);
    });
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

// Get all borrowers
app.get('/borrowers', (req, res) => {
  const result = borrowers.map(borrower => {
    const book = books.find(b => b.id === borrower.bookId);
    const user = users.find(u => u.id === borrower.userId);
    return { ...borrower, book, user };
  });
  res.json(result);
});

// Borrow a book
app.post('/borrow', (req, res) => {
  const { userId, bookId } = req.body;
  const user = users.find(u => u.id === userId);
  const book = books.find(b => b.id === bookId);

  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!book) return res.status(404).json({ error: 'Book not found' });

  if (borrowers.find(b => b.bookId === bookId)) {
    return res.status(400).json({ error: 'Book already borrowed' });
  }

  borrowers.push({ userId, bookId });
  res.status(201).json({ userId, bookId });
});

// Return a borrowed book
app.post('/return', (req, res) => {
  const { userId, bookId } = req.body;
  const index = borrowers.findIndex(b => b.userId === userId && b.bookId === bookId);

  if (index === -1) return res.status(404).json({ error: 'Borrow record not found' });

  borrowers.splice(index, 1);
  res.status(200).json({ userId, bookId });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

