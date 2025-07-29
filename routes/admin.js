const { Router } = require('express');
const { adminModel } = require('../db');
const { courseModel } = require('../db');
const adminRouter = Router();
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_ADMIN_SECRET } = require("../config");
const { adminMiddleware } = require('../middleware/admin')

adminRouter.post('/signup', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    // Logic to handle admin signup

    const adminSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
        firstName: z.string().min(1),
        lastName: z.string().min(1)
    })
    const validation = adminSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
    }

    const hashPassword = bcrypt.hashSync(password, 10); // It will hash the password into a secure format 
    try {
        await adminModel.create({
            email: email,
            password: hashPassword,
            firstName: firstName,
            lastName: lastName
        });
        return res.status(201).json({ message: 'Admin created successfully' });
    }
    catch (err) {
        return res.status(400).json({ error: 'Admin already exists' });
    }
});

adminRouter.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    // Logic to handle admin signin

    const admin = await adminModel.findOne({ email: email });
    if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
    }
    else {
        const isPasswordValid = bcrypt.compareSync(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: admin._id }, JWT_ADMIN_SECRET);
        return res.status(200).json({ message: 'Signin successful', token: token });
    }

});

adminRouter.use(adminMiddleware);

//Creating the course
adminRouter.post('/course', async (req, res) => {
    const adminId = req.userId;
    const { title, description, imageUrl, price } = req.body;
    const course = await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        adminId: adminId
    });

    res.status(201).json({
        message: 'Course created successfully',
        course: course,
        courseId: course._id
    });
});

//Updating the course
adminRouter.put('/course', async (req, res) => {
    const adminId = req.userId;
    const { title, description, imageUrl, price, courseId } = req.body;
    // Logic to update course details

    //Find the course by ID and adminId to ensure only the admin can update it
    const courseExists = await courseModel.findOne({ _id: courseId, adminId: adminId });
    if (!courseExists) {
        return res.status(404).json({ error: 'Course not found or you do not have permission to update it' });
    }
    const course = await courseModel.updateOne(
        { _id: courseId, adminId: adminId },
        { title: title, description: description, imageUrl: imageUrl, price: price }
    );

    res.status(200).json({
        message: 'Course updated successfully',
        course: course
    });
});

adminRouter.get('/course', async (req, res) => {
    const adminId = req.userId;
    
    const courses = await courseModel.find({
        adminId: adminId
    });
    res.status(200).json({
        message: 'Courses fetched successfully',
        courses: courses
    });
});


module.exports = {
    adminRouter: adminRouter
}