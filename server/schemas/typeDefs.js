const { gql } = require("apollo-server-express");

const typeDefs = gql`

type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    books: [String]!
}

type Book {
    _id: ID!
    authors: String!
    description: String!
    bookId: String!
    image: String!
    link: String!
    title: String!
}

type Query {
    user(userId: ID!): User
    # book: [Book!]!
}

type Mutation {
    createUser(username: String! email: String!, password: String!) Auth
    login(email: String!, password: String!): Auth
    saveBook: Book
    deleteBook(bookId: ID!): Book
}






`;
