import { ApolloServer, gql } from "apollo-server";
import * as mongoose from "mongoose";

import Question from "./Models/Question";
import Answer from "./Models/Answer";

mongoose
  .connect("mongodb://database:27017/stackunderflow", {
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
    questionId: ID
    content: String
    author: User
    sourceId: ID
  }

  input InputAnswer {
    questionId: ID
    content: String
    author: InputUser
  }

  input InputEditAnswer {
    answerId: ID
    newContent: String
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
    addAnswer(input: InputAnswer): Answer
    editAnswer(input: InputEditAnswer): Answer
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
    async addAnswer(_, { input: { questionId, content, author } }) {
      const NewAnswer = await Answer.create({ questionId, content, author });
      const questionFromDB = await Question.findById(questionId);
      console.log("question from db", questionFromDB);
      console.log("answers", questionFromDB.answers.length);
      if (questionFromDB.answers.length < 10) {
        questionFromDB.answers.push({
          content: NewAnswer.content,
          author: NewAnswer.author,
          sourceId: NewAnswer._id,
        });
        questionFromDB.save();
      }

      return await NewAnswer;
    },
    async editAnswer(_, { input: { answerId, newContent } }) {
      const updatedAnswerFromDB = await Answer.findByIdAndUpdate(
        answerId,
        { content: newContent },
        { new: true }
      );

      const questionFromDb = await Question.findById(
        updatedAnswerFromDB.questionId
      );

      const answerIndex = questionFromDb.answers.findIndex((el) =>
        el.sourceId.equals(updatedAnswerFromDB._id)
      );

      if (answerIndex !== -1) {
        questionFromDb.answers[answerIndex] = updatedAnswerFromDB;
        questionFromDb.markModified("answers");
        questionFromDb.save();
      }
      return updatedAnswerFromDB;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
