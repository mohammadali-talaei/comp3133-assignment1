// server.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

async function startServer() {
  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  mongoose.connect('mongodb://localhost:27017/comp3133_assigment1', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen(4000, () => console.log(`Server running at http://localhost:4000${apolloServer.graphqlPath}`));
}

startServer();
