const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findOne({ _id: context.user._id });

        return user;
      }

      throw new AuthenticationError("Not logged in");
    },
  }, // this is the end of the Query

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
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
    saveBook: async (parent, { book }, context) => {
      if (context.user) {
        return User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: book } }, // The $addToSet operator adds a value to an array unless the value is already present, in which case $addToSet does nothing to that array.
          { new: true, runValidators: true }
        );
      } // end of if statement
      throw new AuthenticationError("You need to be logged in!");
    },
    // remove a book from `savedBooks`
    removeBook: async (parent, { bookId }, context) => {
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
