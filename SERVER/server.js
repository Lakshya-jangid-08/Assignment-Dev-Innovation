const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config();

const cookieParser = require('cookie-parser');
const { errorHandler, notFound } = require('./utils/errorHandler.js');
const noteRoutes = require('./routes/notes.routes.js');
const bookmarkRoutes = require('./routes/bookmarks.routes.js');
const connectDb = require('./config/db.config.js');
connectDb();

const authRoutes = require('./routes/user.routes.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173', // frontend origin
    'https://assignment-dev-innovation.vercel.app',
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/notes', noteRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send("Server running");
});



app.use(notFound);
app.use(errorHandler);


module.exports = app;