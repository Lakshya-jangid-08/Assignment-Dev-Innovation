const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-bookmarks')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    })
}

module.exports = connectDb