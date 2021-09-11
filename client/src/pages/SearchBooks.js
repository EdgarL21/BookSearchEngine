import React, { useState, useEffect } from "react";
import {
  Jumbotron,
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
} from "react-bootstrap";

import Auth from "../utils/auth";
import { searchGoogleBooks } from "../utils/API";
import { saveBookIds, getSavedBookIds } from "../utils/localStorage";

import { useMutation } from "@apollo/client";
import { SAVE_BOOK } from "../utils/mutations";

const SearchBooks = () => {
  const [saveBook, { error }] = useMutation(SAVE_BOOK);
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      // this puts search input into the google api
      const response = await searchGoogleBooks(searchInput);
      console.log("response");
      console.log(response);
      console.log("response");

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      // this gets the response json and puts it into the varaible items
      const { items } = await response.json();
      console.log("items");
      console.log(items);
      console.log("items");

      // maps through the array to grab 10 books with this information and puts them into the variables on the left
      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ["No author to display"],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || "",
      }));
      console.log(bookData);
      // console.log(title);

      // sets setSearchBooks to bookData which is the array
      setSearchedBooks(bookData);
      console.log("-=-=-=-");
      console.log(setSearchedBooks); // logs a method
      console.log(bookData); // logs array
      console.log(setSearchedBooks(bookData)); // logs undefined
      console.log("searchedBooks");
      console.log(searchedBooks);

      // sets setSearchinput back to ''
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  // it takes in a parameter of bookId which i gets gets from the
  const handleSaveBook = async (bookId) => {
    console.log(bookId); // id of the book whose button was pressed ot save

    // find the book in `searchedBooks` state by the matching id
    // finds through the searchedBooks array and grabs the book.bookId and checks if === bookId and puts in to bookToSave
    // create a variable bookToSave set it equal to the searchBooks which finds a book that comes from the array and matches  the book.bookId(array) is equal to the bookId(book to be saved)
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    console.log(bookToSave); // logs the data of the book we are trying to save

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null; // creates a toekn that runs loggedIn method with a ternary operator that gets token if loggedIn(true) and gets null if not loged in
    console.log(token); // logs token
    // another if statement that if token is false it returns false and ends the app, if token true then it skinsp this line of code and goes to the next line
    if (!token) {
      return false;
    }

    //
    try {
      const { data } = await saveBook({
        variables: { book: bookToSave },
      });
      console.log(data);

      if (error) {
        throw new Error("something went wrong!");
      }
      console.log(data);
      // grabs bookToSave and token and runs it through the saveBook function being imported from utils/API
      // save Book is a put function that saves to database
      // puts it all in the response variable
      // const response = await saveBook(bookToSave, token);

      // chechs if response is ok
      // if its not then it sends an error
      // if its ok proceeds to the next lines of code
      // if (!response.ok) {
      //   throw new Error("something went wrong!");
      // }

      // if book successfully saves to user's account, save book id to state
      console.log("---------------------------------");
      console.log(saveBookIds);
      console.log("---------------------------------");
      console.log(bookToSave);
      console.log("---------------------------------");
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : "Search for a book to begin"}
        </h2>
        <CardColumns>
          {searchedBooks.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds?.some(
                        (savedBookId) => savedBookId === book.bookId
                      )}
                      className="btn-block btn-info"
                      onClick={() => handleSaveBook(book.bookId)}
                    >
                      {savedBookIds?.some(
                        (savedBookId) => savedBookId === book.bookId
                      )
                        ? "This book has already been saved!"
                        : "Save this Book!"}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchBooks;
