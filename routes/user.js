const { Router } = require('express');
const userRouter = Router();
const { userModel } = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { z } = require('zod');
const JWT_USER_SECRET="iamtheuser";

userRouter.post('/signup', async (req, res) => {
    const { username, password,firstName,lastName } = req.body;

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
            password : password,
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
        return res.status(404).json({ error: 'Admin not found' });
    }

    else{
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, JWT_ADMIN_SECRET);
        return res.status(200).json({ message: 'Signin successful', token: token });
    }
});

userRouter.get('/purchases', (req, res) => {

});

module.exports = {
    userRouter: userRouter
}
