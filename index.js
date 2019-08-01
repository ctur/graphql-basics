import { GraphQLServer } from "graphql-yoga";
import chalk from "chalk";
import uuidv4 from "uuid/v4";

import db from "./src/db.tmp";

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, { db }, info) {
      const { query } = args;
      if (query) {
        return db.users.filter(({ name }) => {
          return name.toLowerCase().includes(query);
        });
      }
      return db.users;
    },
    posts(parent, args, { db }, info) {
      const { query } = args;
      if (query) {
        return db.posts.filter(({ title, body }) => {
          return (
            title.toLowerCase().includes(query.toLowerCase()) ||
            body.toLowerCase().includes(query.toLowerCase())
          );
        });
      }
      return db.posts;
    },
    comments(parent, args, { db }, info) {
      return db.comments;
    },
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
      };
    }
  },
  Mutation: {
    createUser(parent, args, { db }, info) {
      const emailInUse = db.users.some(user => user.email === args.data.email);

      if (emailInUse) throw new Error("Email address already in use.");
      const user = {
        id: uuidv4(),
        ...args.data
      };
      db.users.push(user);
      return user;
    },
    deleteUser(parent, args, { db }, info) {
      const userIndex = db.users.findIndex(user => user.id === args.id);
      if (userIndex === -1) throw new Error("User does not exist");

      const deletedUsers = db.users.splice(userIndex, 1);

      posts = db.posts.filter(post => {
        const match = post.author === args.id;
        if (match) {
          db.comments = db.comments.filter(comment => comment.post !== post.id);
        }
        return !match;
      });
      db.comments = db.comments.filter(comment => comment.author !== args.id);

      return deletedUsers[0];
    },
    createPost(parent, args, { db }, info) {
      const userExists = db.users.some(user => user.id === args.data.author);

      if (!userExists) throw new Error("User does not exist.");

      const post = {
        id: uuidv4(),
        ...args.data
      };
      db.posts.push(post);
      return post;
    },
    deletePost(parent, args, { db }, info) {
      const postIndex = db.posts.findIndex(post => post.id === args.id);
      if (postIndex === -1) throw new Error("Post does not exist");

      const deletedPosts = db.posts.splice(postIndex, 1);
      db.comments = db.comments.filter(comment => comment.post !== args.id);

      return deletedPosts[0];
    },
    createComment(parent, args, { db }, info) {
      const userExist = db.users.some(user => user.id === args.data.author);
      if (!userExist) throw new Error("User does not exist.");

      const postExistPublished = db.posts.some(
        post => post.id === args.data.post && post.published
      );
      if (!postExistPublished)
        throw new Error("Post does not exist or not published.");

      const comment = {
        id: uuidv4(),
        ...args.data
      };
      db.comments.push(comment);
      return comment;
    },
    deleteComment(parent, args, { db }, info) {
      const commentIndex = db.comments.findIndex(
        comment => comment.id === args.id
      );
      if (commentIndex === -1) throw new Error("Comment does not exist");

      const deletedComments = db.comments.splice(commentIndex, 1);
      return deletedComments[0];
    }
  },
  Post: {
    author(parent, args, { db }, info) {
      return db.users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  },
  User: {
    posts(parent, args, { db }, info) {
      return db.posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent, args, { db }, info) {
      return db.users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, { db }, info) {
      return db.posts.find(post => {
        return post.id === parent.post;
      });
    }
  }
};

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
  resolvers,
  context: { db },
  middlewares: [logInput]
});

server.start(() => {
  console.log("Server is running...");
});
