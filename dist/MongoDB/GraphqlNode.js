const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const DBCon = mongoose
    .connect(`mongodb+srv://${process.env.MONGODBUSER}:<${process.env.MONGOPW}>@cluster0.6xtql.mongodb.net/${process.env.MONGODB}?retryWrites=true&w=majority`)
    .then((response) => console.log('MongoDB connected successfully', response))
    .catch((err) => console.log('Error While connecting MongoDB', err));
export { DBCon };
