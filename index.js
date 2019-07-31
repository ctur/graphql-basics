import { GraphQLServer } from "graphql-yoga";

// Type definitions (schema)
// ! Always returns String
const typeDefs = `
  type Query {
    hello: String!
    name: String!
    location: String!
    bio: String!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    hello() {
      return "Hello GraphQL";
    },
    name() {
      return "Janet Doe";
    },
    location() {
      return "Istanbul";
    },
    bio() {
      return "Working progress GraphQL";
    }
  }
};

const logInput = async (resolve, root, args, context, info) => {
  console.log("----- LOG -----");
  console.log(`Input: ${JSON.stringify(args)}`);
  console.log(`Requested to '${info.path.key}'`);
  const result = await resolve(root, args, context, info);
  return result;
};

const logResult = async (resolve, root, args, context, info) => {
  const result = await resolve(root, args, context, info);
  console.log(`Result: ${JSON.stringify(result)}`);
  console.log("----- LOG -----\n");
  return result;
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  middlewares: [logInput, logResult]
});

server.start(() => {
  console.log("Server is running");
});
