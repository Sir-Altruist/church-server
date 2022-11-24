const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const api = require('./routes');

const PORT = 5000;

mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useCreateIndex: true,
  })
  .then(() => console.log('Database connected successfully!'))
  .catch((err) => console.log(err));

// Cross Origin Resource Sharing
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', api);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
