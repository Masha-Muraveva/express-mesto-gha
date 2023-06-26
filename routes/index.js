const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFound = require('../Error/NotFound');

const signInRouter = require('./signin');
const signUpRouter = require('./signup');
const cardsRouter = require('./cards');
const usersRouter = require('./users');

router.use('/', signInRouter);
router.use('/', signUpRouter);

router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use((req, res, next) => next(new NotFound('Страницы по данному URL не существует')));

module.exports = router;
