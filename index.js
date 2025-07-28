const express=require('express');
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');

const app=express();
app.use(express.json());
mongoose.connect("mongodb+srv://sengardeep2006:deepRAJ%4019@cluster0.d8emwyn.mongodb.net/course-selling-app")

app.use('/user',userRouter);
app.use('/course',courseRouter);



app.listen(3000);