const PORT = 3000;
const URL_DB = 'mongodb://127.0.0.1/mestodb';
const SECRET_KEY = 'eyJ1c2VySWQiOiI2NDk4ZDkyZTQ5YTFhZjYzNTUyMWIzMzMiLCJpYXQiOjE2ODc3Mzk2NzIsImV4cCI6MTY4ODM0NDQ3Mn0';
const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

module.exports = {
  PORT,
  URL_DB,
  SECRET_KEY,
  URL_REGEX,
};
