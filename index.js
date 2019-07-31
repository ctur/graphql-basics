import { GraphQLServer } from "graphql-yoga";
import chalk from "chalk";

// String, Boolean, Int, Float, ID -> Scalar Types

// Type definitions (schema)
// ! Always returns that type
const typeDefs = `
  type Query {
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    me() {
      return {
        id: "123098",
        name: "Janet",
        email: "janet@janetxyz.com",
        age: 24
      };
    },
    post() {
      return {
        id: "asdf123",
        title: "hello",
        body: "this might be body",
        published: true
      }
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
