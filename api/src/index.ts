import { ApolloServer, gql } from "apollo-server";
import * as mongoose from "mongoose";

import Question from "./Models/Question";

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
    getAllQuestions: [Question]
    getQuestionById(id: String): Question
  }
  type Mutation {
    addQuestion(input: InputQuestion): Question
  }
`;

const resolvers = {
  Query: {
    async getAllQuestions() {
      return await Question.find();
    },
    async getQuestionById(_, args) {
      return await Question.findById(args.id);
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
