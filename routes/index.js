const router = require('express').Router();
const { checkAuthorizedUser } = require('../middlewares/auth');
const NotFound = require('../Error/NotFound');

const signInRouter = require('./signin');
const signUpRouter = require('./signup');
const cardsRouter = require('./cards');
const usersRouter = require('./users');

router.use('/', signInRouter);
router.use('/', signUpRouter);

router.use('/users', checkAuthorizedUser, usersRouter);
router.use('/cards', checkAuthorizedUser, cardsRouter);
router.use((req, res, next) => next(new NotFound('Страницы по данному URL не существует')));

module.exports = router;
