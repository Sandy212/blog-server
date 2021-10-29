const { ApolloServer, gql } = require("apollo-server");
const { v4: uuid } = require("uuid");

const blogArray = [
  {
    id: 1,
    title: "how to make a youtube video",
    content: "making you videos",
    image: "1.jpg",
    date: "10/11/2021",
    author: 1,
  },
  {
    id: 2,
    title: "how to learn quickly",
    content: "The quickest way to learn",
    image: "2.jpg",
    date: "1/01/2021",
    author: 2,
  },
  {
    id: 3,
    title: "playing football",
    content: "watch this fooball match",
    image: "3.jpg",
    date: "05/03/2021",
    author: 2,
  },
];

const authorsData = [
  {
    id: 1,
    name: "Sandy",
    image: "1.img",
    author: 1,
  },
  {
    id: 2,
    name: "Nunoo",
    image: "2.img",
  },
  {
    id: 3,
    name: "Naa",
    image: "3.img",
  },
];

const commentsData = [
  {
    id: 1,
    body: "you did well",
    author: 10,
    blogId: 1,
  },
  {
    id: 2,
    body: "thanks by the way",
    author: 10,
    blogId: 2,
  },
  {
    id: 3,
    body: "i think this way is better",
    author: 3,
    blogId: 3,
  },
];

const typeDefs = gql`
  type Query {
    readBlog(id: ID!): Blog!
    readBlogs: [Blog]!
    readComments(id: ID!): [Comment!]!
  }

  type Blog {
    id: ID!
    title: String!
    body: String!
    image: String
    author: Author!
    comments: [Comment]
  }

  type Author {
    id: ID!
    name: String!
    image: String!
  }

  type Comment {
    id: ID!
    body: String!
    author: Author!
    blog: Blog!
  }

  type Mutation {
    createBlog(
      id: ID!
      title: String!
      body: String!
      Image: String!
      author: Int
    ): Blog!

    updateBlog(
      id: ID!
      title: String!
      body: String!
      Image: String!
      author: Int
    ): Blog!

    deleteBlog(id: ID!): String
  }
`;

const resolvers = {
  Query: {
    readBlog: (parent, args, context) => {
      const blogID = args.id;
      const blog = blogArray.find((blogel) => blogel.id == blogID);

      const authorDetails = authorsData.find(
        (authorel) => authorel.id == blog.author
      );

      let newBlog = {
        ...blog,
        author: authorDetails,
      };
      return newBlog;
    },
    readBlogs: (parent, args, context) => blogArray,

    // Accept post id to query all the comments related to it
    readComments: (parent, args, context) => {
      const blogID = args.id;
      if (blogID) {
        const newComments = commentsData.find(
          (comment) => comment.blogId == blogID
        );
        return [newComments];
      }
    },
  },

  Mutation: {
    createBlog: (parent, args) => {
      console.log(args);
      const inputData = {
        ...args,
        id: uuid(),
      };
      const newBlogData = [inputData, ...blogArray];
      console.log(newBlogData);
      return inputData;
    },

    updateBlog: (parent, args) => {
      const updateId = args.id;
      const currentBlog = blogArray.filter((blog) => blog.id == args.id);
      const updatedBlog = {
        ...currentBlog,
        id: uuid(),
      };

      const newBlogData = [updatedBlog, ...blogArray];
      return updatedBlog;
    },

    deleteBlog: (parent, args) => {
      const currentBlogS = blogArray.filter((blog) => blog.id != args.id);
      return "Blog deleted";
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at at ${url}`);
});
