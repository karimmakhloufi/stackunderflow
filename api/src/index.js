import { ApolloServer, gql } from "apollo-server";
import mongoose from "mongoose";

import Question from "./Models/Question.js";

mongoose
  .connect("mongodb://database:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
  });

const typeDefs = gql`
  type User {
    email: String
  }

  type Question {
    content: String
    author: User
  }

  input InputUser {
    email: String
  }

  input InputQuestion {
    content: String
    author: InputUser
  }

  type Query {
    questions: [Question]
  }
  type Mutation {
    addQuestion(input: InputQuestion): Question
  }
`;

const resolvers = {
  Query: {
    async questions() {
      return await Question.find();
    },
  },
  Mutation: {
    async addQuestion(parent, args) {
      const createdQuestion = await Question.create(args.input);
      console.log("createdQuestion", createdQuestion);
      return createdQuestion;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
