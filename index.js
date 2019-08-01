import { GraphQLServer } from "graphql-yoga";
import chalk from "chalk";

import db from "./src/db.tmp";
import Query from "./src/resolvers/Query";
import Mutation from "./src/resolvers/Mutation";
import User from "./src/resolvers/User";
import Post from "./src/resolvers/Post";
import Comment from "./src/resolvers/Comment";

const logInput = async (resolve, root, args, context, info) => {
  console.log(
    chalk.cyan(
      `Requested for '${info.path.key}', Input: ${JSON.stringify(args)}`
    )
  );
  const result = await resolve(root, args, context, info);
  return result;
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: { Query, Mutation, User, Post, Comment },
  context: { db },
  middlewares: [logInput]
});

server.start(() => {
  console.log("Server is running...");
});
