const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');

const router = require('./routes/index');
const { createUser, login } = require('./controllers/auth');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://127.0.0.1/mestodb');

app.use(helmet());
app.disable('x-powered-by');
app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/', router);

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
