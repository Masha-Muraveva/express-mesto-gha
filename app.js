const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');

const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes/index');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1/mestodb' } = process.env;
const app = express();
mongoose.connect(DB_URL);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
