import { ApolloServer, gql } from "apollo-server";
import mongoose from "mongoose";

import Topic from "./Models/Topic.js";

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

  type Topic {
    content: String
    author: User
  }

  input InputUser {
    email: String
  }

  input InputTopic {
    content: String
    author: InputUser
  }

  type Query {
    topics: [Topic]
  }
  type Mutation {
    addTopic(input: InputTopic): Topic
  }
`;

const resolvers = {
  Query: {
    async topics() {
      return await Topic.find();
    },
  },
  Mutation: {
    async addTopic(parent, args) {
      console.log("args", args.input);
      const createdTopic = await Topic.create(args.input);
      return createdTopic;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
