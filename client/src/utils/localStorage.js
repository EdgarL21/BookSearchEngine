export const getSavedBookIds = () => {
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : [];

  return savedBookIds;
};

// this gets imported  in the SearchBooks.js component
// bookIdArr is the id that comes with every book in the API
export const saveBookIds = (bookIdArr) => {
  if (bookIdArr.length) {
    console.log("bookIdArr");
    console.log(bookIdArr);
    console.log("bookIdArr");
    // saved_books is the name of the key in local storage // Json.strigify(bookIdArr) is the name of the value
    localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem('saved_books');
  }
};

export const removeBookId = (bookId) => {
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : null;

  if (!savedBookIds) {
    return false;
  }

  const updatedSavedBookIds = savedBookIds?.filter((savedBookId) => savedBookId !== bookId);
  localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));

  return true;
};
