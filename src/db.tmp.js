let users = [
  {
    id: "1",
    name: "Jesse",
    email: "jesse@example.com",
    age: 23
  },
  {
    id: "2",
    name: "Erica",
    email: "erica@example.com"
  },
  {
    id: "3",
    name: "Sarah",
    email: "sarah@example.com"
  }
];

let posts = [
  {
    id: "1",
    title: "GraphQL 101",
    body: "Starter for GraphQL",
    published: true,
    author: "1"
  },
  {
    id: "2",
    title: "GraphQL 201",
    body: "Intermediate for GraphQL",
    published: true,
    author: "1"
  },
  {
    id: "3",
    title: "GraphQL 301",
    body: "Advanced for GraphQL",
    published: true,
    author: "2"
  }
];

let comments = [
  {
    id: "1001",
    text: "test comment 1",
    author: "1",
    post: "1"
  },
  {
    id: "1002",
    text: "test comment 2",
    author: "2",
    post: "2"
  },
  {
    id: "1003",
    text: "test comment 3",
    author: "3",
    post: "2"
  },
  {
    id: "1004",
    text: "test comment 4",
    author: "3",
    post: "3"
  }
];

const db = {
  users,
  posts,
  comments
};

export { db as default };
