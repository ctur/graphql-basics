import { GraphQLServer } from "graphql-yoga";
import chalk from "chalk";

// String, Boolean, Int, Float, ID -> Scalar Types

// Type definitions (schema)
// ! Always returns that type
const typeDefs = `
  type Query {
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    inStock: Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    title() {
      return "title";
    },
    price() {
      return 4.95;
    },
    releaseYear() {
      return 2015;
    },
    rating() {
      return 3.23;
    },
    inStock() {
      return false;
    }
  }
};

const logInput = async (resolve, root, args, context, info) => {
  console.log(
    chalk.blue(
      `Requested to '${info.path.key}', Input: ${JSON.stringify(args)}\n`
    )
  );
  const result = await resolve(root, args, context, info);
  return result;
};

// const logResult = async (resolve, root, args, context, info) => {
//   console.log(`Result: ${JSON.stringify(result)}`);
//   console.log("----- END -----\n");
//   const result = await resolve(root, args, context, info);
//   return result;
// };

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  middlewares: [logInput]
});

server.start(() => {
  console.log("Server is running...");
});
