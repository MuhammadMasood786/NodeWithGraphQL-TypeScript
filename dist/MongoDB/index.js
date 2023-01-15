import express from 'express';
import mongoose, { model, Schema } from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { ApolloServer, gql } from 'apollo-server-express';
// const url = `mongodb+srv://MMasoodR786:MMasoodR786@cluster0.6xtql.mongodb.net/?retryWrites=true&w=majority`;
dotenv.config();
const url = `mongodb+srv://${process.env.MONGODBUSER}:${process.env.MONGOPW}@cluster0.6xtql.mongodb.net/?retryWrites=true&w=majority`;
const connect = mongoose.connect(url);
const bookSchema = new Schema({
    id: {
        type: Number,
        reqiured: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});
const Books = model('Book', bookSchema);
const typeDefs = gql `

    type Book {
        id:ID!
        title:String!
        author:String!
        rating:Float!
    }

    type Query {
        getBooks :[Book]
        getBook(id:ID!):Book
    }

    type Mutation {
        addBook(title:String!,author:String!,rating:Float!):Book
        updateBook(title:String!,author:String!,rating:Float!):Book
        deleteBook(id:ID!):Book
    }

    `;
const resolvers = {
    Query: {
        getBooks: (parent, args) => {
            const result = Books.find({}).then((response) => {
                console.log("getBooks", response);
                return response;
            }).catch((error) => {
                return error;
            });
            return result;
        },
        getBook: (parent, args) => {
            const result = Books.findById(args.id).then((response) => {
                return response;
            }).catch((error) => {
                return error;
            });
            return result;
        }
    },
    Mutation: {
        addBook: (parent, args) => {
            let Book = new Books({
                title: args.title,
                author: args.author,
                rating: args.rating
            });
            const result = Book.save().then((response) => {
                return response;
            }).catch((error) => {
                return error;
            });
            return result;
        },
        updateBook: (parent, args) => {
            if (!args.id)
                return;
            const result = Books.findByIdAndUpdate({
                _id: args.id
            }, {
                $set: {
                    title: args.title,
                    author: args.author,
                    rating: args.rating
                }
            }, {
                new: true
            }, (err, Book) => {
                if (err) {
                    console.log('Something went wrong when updating the Book');
                }
            }).then((response) => {
                return response;
            }).catch((error) => {
                return error;
            });
            return result;
        },
        deleteBook: (parent, args) => {
            const result = Books.findOneAndRemove({ _id: args.id }).then((response) => {
                return response;
            }).catch((error) => {
                return error;
            });
            return result;
        },
    }
};
connect
    .then((response) => console.log('MongoDB connected successfully'))
    .catch((err) => console.log('Error While connecting MongoDB', err));
mongoose.set('strictQuery', true);
const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers
});
await server.start();
const app = express();
app.use(bodyParser.json());
app.use('*', cors());
server.applyMiddleware({ app });
app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
