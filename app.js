const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://127.0.0.1/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6491b024a8aacb8202c759ed',
  };

  next();
});

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
