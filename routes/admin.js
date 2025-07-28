const { Router } = require('express');

const adminRouter = Router();

adminRouter.post('/signup', (req, res) => {
    const { username, password } = req.body;
    res.json({
        msg: "Signed up"
    })
});

adminRouter.post('/signin', (req, res) => {

});

adminRouter.post('/course', (req, res) => {

});

adminRouter.get('/course', (req, res) => {

});


module.exports={
    adminRouter:adminRouter
}