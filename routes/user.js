const { Router } = require('express');
const userRouter = Router();
const { userModel,courseModel } = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { z } = require('zod');
const {JWT_USER_SECRET} = require("../config");
const {purchaseModel} = require("../db");
const course = require('./course');
const { userMiddleware } = require('../middleware/user');

userRouter.post('/signup', async (req, res) => {
    const { email, password,firstName,lastName } = req.body;

    const userSchema=z.object({
        email : z.string().email(),
        password : z.string().min(5)
    })

    const validation = userSchema.safeParse(req.body);
    if(!validation.success){
        res.status(400).json({error : validation.error.errors});
    }

    const hashPassword = bcrypt.hashSync(password,10);
    try{
        await userModel.create({
            email : email,
            password : hashPassword,
            firstName : firstName,
            lastName : lastName
        });
        return res.status(201).json({
            msg : "User Created Successfully"
        })
    }
    catch(e){
        res.status(400).json({error : e})
    }
});

userRouter.post('/signin', async(req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    else{
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        console.log(user.password, password, isPasswordValid);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, JWT_USER_SECRET);
        return res.status(200).json({ message: 'Signin successful', token: token });
    }
});

userRouter.get('/purchases', userMiddleware, async (req, res) => {
    const userId = req.userId;
    const purchases = await purchaseModel.find({ userId: userId });
    if (!purchases) {
        return res.status(404).json({ error: 'No purchases found' });
    }
    const courseData = await courseModel.find({ _id: { $in: purchases.map(p => p.courseId) } });
    res.status(200).json({ purchases, courseData });
});

module.exports = {
    userRouter: userRouter
}
