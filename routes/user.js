// const express = require('express');
// const Router = express.Router();
const { Router } = require('express');
const userRouter = Router();

userRouter.post('/signup', (req, res) => {
    const { username, password } = req.body;

});

userRouter.post('/signin', (req, res) => {

});

userRouter.get('/purchases', (req, res) => {

});

module.exports = {
    userRouter: userRouter
}
