const express=require('express');
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const {adminRouter} = require('./routes/admin');
require('dotenv').config();

const app=express();
app.use(express.json());

app.use('/user',userRouter);
app.use('/course',courseRouter);
app.use('/admin',adminRouter);

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3000,()=>{
        console.log("Listening to port 3000");
    });
}
main();