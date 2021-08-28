const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    // user comes from typeDefs
    user: async (parent, { id }) => {
      // this line connects to typeDefs
      return User.findOne({ _id: id }); // this line connects to our models
    },
  }, // this is the end of the Query

  Mutation: {
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Can't find this user");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Wrong password!");
      }

      const token = signToken(user);
      return { token, user };
    },
    // remove a book from `savedBooks`
    deleteBook: async (parent, { bookId }, context) => {
      if (context.user) {
        return User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } }, // The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
          { new: true }
        );
      } // end of if statement
      throw new AuthenticationError("You need to be logged in!");
    },
  }, // end of Mutation
}; // end of resolvers

module.exports = resolvers;
