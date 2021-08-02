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
    id: ID
    email: String
  }

  input InputUser {
    email: String
  }

  type Answer {
    id: ID
    content: String
    author: User
  }

  input InputAnswer {
    question: ID
    content: String
    author: InputUser
  }

  type Question {
    id: ID
    content: String
    author: User
    answers: [Answer]
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
    addAnswer(input: InputAnswer): Question
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
    async addAnswer(_, { input: { question, content, author } }) {
      const questionFromDB = await Question.findById(question);
      console.log("question from db", questionFromDB);
      questionFromDB.answers.push({ content, author });
      return await questionFromDB.save();
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
