const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;

const User=new Schema({
    email : {type: String,unique: true},
    password : String,
    firstName : String,
    lastName : String
})

const Course = new Schema({
    title : String,
    description : String,
    price : Number,
    imageUrl : String,
    adminId : ObjectId
})

const Admin = new Schema({
    email : {type: String,unique: true},
    password : String,
    firstName : String,
    lastName : String
})

const Purchase = new Schema({
    userId : ObjectId,
    courseId : ObjectId
})

const userModel=mongoose.model('users',User);
const courseModel=mongoose.model('courses',Course);
const adminModel=mongoose.model('admins',Admin);
const purchaseModel=mongoose.model('purchases',Purchase);

module.exports={
    userModel : userModel,
    courseModel : courseModel,
    adminModel : adminModel,
    purchaseModel : purchaseModel
}