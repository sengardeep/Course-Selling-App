const express=require('express');
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const path = require('path');
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const {adminRouter} = require('./routes/admin');
require('dotenv').config();

const app=express();
app.use(express.json());

// Enable CORS for frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

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