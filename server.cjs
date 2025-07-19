const { ApolloServer } = require("apollo-server");
const { typeDefs } = require("./graphql/typedefs");
const { resolvers } = require("./graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: "*", // разрешить все источники (или укажите конкретные)
    credentials: true,
  },
});

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
