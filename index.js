import { GraphQLServer } from "graphql-yoga";
import chalk from "chalk";

// Demo usera data
const users = [
  {
    id: '1',
    name: 'Jesse',
    email: 'jesse@example.com',
    age: 23
  },
  {
    id: '2',
    name: 'Erica',
    email: 'erica@example.com'
  },
  {
    id: '3',
    name: 'Sarah',
    email: 'sarah@example.com'
  }
]

const posts = [
  {
    id: '1',
    title: 'GraphQL 101',
    body: 'Starter for GraphQL',
    published: true,
    author: '1'
  },
  {
    id: '2',
    title: 'GraphQL 201',
    body: 'Intermediate for GraphQL',
    published: false,
    author: '1'
  },
  {
    id: '3',
    title: 'GraphQL 301',
    body: 'Advanced for GraphQL',
    published: false,
    author: '2'
  }
]

const comments = [
  {
    id: '1001',
    text: 'test comment 1',
    author: '1',
    post: '1'
  },
  {
    id: '1002',
    text: 'test comment 2',
    author: '2',
    post: '2'
  },
  {
    id: '1003',
    text: 'test comment 3',
    author: '3',
    post: '2'
  },
  {
    id: '1004',
    text: 'test comment 4',
    author: '3',
    post: '3'
  }
]

// String, Boolean, Int, Float, ID -> Scalar Types

// Type definitions (schema)
// ! Always returns that type
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      const { query } = args;
      if (query) {
        return users.filter(({ name }) => {
          return name.toLowerCase().includes(query)
        })
      }
      return users
    },
    posts(parent, args, ctx, info) {
      const { query } = args;
      if (query) {
        return posts.filter(({ title, body }) => {
          return title.toLowerCase().includes(query.toLowerCase()) || body.toLowerCase().includes(query.toLowerCase())
        })
      }
      return posts
    },
    comments(parent, args, ctx, info) {
      return comments
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
      }
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      })
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id
      })
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      })
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post;
      })
    }
  }
};

const logInput = async (resolve, root, args, context, info) => {
  console.log(
    chalk.cyan(
      `Requested to '${info.path.key}', Input: ${JSON.stringify(args)}`
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
