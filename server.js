require('dotenv').config(); // Load environment variables from .env file
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

  try {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => 
      console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`)
    );
  } catch (error) {
    console.error('Server start error:', error);
  }
}

startServer();
