const Query = {
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
};

export default Query;
