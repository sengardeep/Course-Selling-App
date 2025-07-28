const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const User=new Schema({
    email : {trype: String,unique: true},
    password : String,
    firstName : String,
    lastName : String
})

const Course = new Schema({
    title : String,
    description : String,
    price : Number,
    imageUrl : String,
    creatorId : ObjectId
})

const Admin = new Schema({
    email : {trype: String,unique: true},
    password : String,
    firstName : String,
    lastName : String
})

const Purchase = new Schema({
    userId : ObjectId,
    courseId : ObjectId
})

const userModel=mongoose.model('user',User);
const courseModel=mongoose.model('course',Course);
const adminModel=mongoose.model('admin',Admin);
const purchaseModel=mongoose.model('purchase',Purchase);

module.exports={
    userModel : userModel,
    courseModel : courseModel,
    adminModel : adminModel,
    purchaseModel : purchaseModel
}