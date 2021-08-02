const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    email: String
  }

  type Topic {
    content: String
    author: User
  }

  type Query {
    topics: [Topic]
  }
  type Mutation {
    addTopic: [Topic]
  }
`;

const resolvers = {
  Query: {
    topics() {
      return topics;
    },
  },
  Mutation: {
    addTopic(parent, args) {
      return "okay";
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
