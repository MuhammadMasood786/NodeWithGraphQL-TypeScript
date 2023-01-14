
import mongoose, { model, Schema } from "mongoose"
import { gql } from 'apollo-server-express';

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
const Books = model('Book', bookSchema)

const typeDefs = gql
    `

    type Book {
        id:ID!
        name:String!
        product:String!
        rating:Float!
    }

    type Query {
        getBooks :[Book]
        getBook(id:ID!):Movie
    }

    type Mutation {
        addBook(title:String!,author:String!,rating:Float!):Book
        updateBook(title:String!,author:String!,rating:Float!):Book
        deleteBook(id:ID!):Book
    }

    `
    
const resolvers = {
    Query: {
        getBooks: (parent: any, args: any) => {
            return Books.find({})
        },
        getBook: (parent: any, args: any) => {
            return Books.findById(args.id)
        }
    },
    Mutation: {
        addBook: (parent: any, args: any) => {
            let Book = new Books({
                title: args.title,
                author: args.author,
                rating: args.rating
            })
            return Book.save();
        },
        updateBook: (parent: any, args: any) => {
            if (!args.id) return;
            return Books.findByIdAndUpdate({
                _id: args.id
            },
                {
                    $set: {
                        title: args.title,
                        author: args.author,
                        rating: args.rating
                    }
                }, {
                new: true
            }, (err, Book) => {
                if (err) {
                    console.log('omething went wrong when updating the movie')
                }
            }
            )
        },
        deleteBook: (parent: any, args: any) => {
            return Books.findByIdAndDelete({ _id: args.id })
        },
    }
}



export { typeDefs, resolvers }