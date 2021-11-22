const { gql } = require('apollo-server-express')

const typeDefs = gql`
    type Auth {
        token: ID!
        profile: User
    }

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Query {
        me: User
    }

    input Input {
        authors: [String]
        description: String!
        title: String
        bookId: String!
        image: String
        link: String
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addeUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: Input): User
        removeBook(bookId: String!): User
    }
`