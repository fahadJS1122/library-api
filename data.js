// data.js

let users = [
    { id: 1, name: 'Ayan' },
    { id: 2, name: 'Bilal' },
    { id: 3, name: 'Zafar'},
    { id: 4, name: 'Ahmed'}
  ];
  
  let books = [
    { id: 1, title: 'Dua', author: 'zafar' },
    { id: 2, title: 'physics', author: 'Harper Lee' },
    { id: 3, title: 'chemistry', author: 'Anderson'},
    { id: 4, title: 'Maths', author: 'George'}
  ];
  
  let borrowers = [
     { userId: 1, bookId: 4 },
     { userId: 2, bookId: 3 },
     { userId: 4, bookId: 2 },
  ];
  
  module.exports = { users, books, borrowers };
  