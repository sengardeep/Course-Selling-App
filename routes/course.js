const { Router } = require('express');
const { courseModel, purchaseModel } = require('../db');
const {userMiddleware} = require('../middleware/user');
const courseRouter = Router();

courseRouter.post('/purchase', userMiddleware, async (req, res) => {
    const { courseId } = req.body;
    const userId = req.userId; // Assuming userMiddleware sets req.user

    await purchaseModel.create({
        userId: userId,
        courseId: courseId
    });

    res.status(201).json({
        message: 'Course purchased successfully'
    });
});

courseRouter.get('/preview', async (req, res) => {
    // A user should able to preview courses without logging in
    try {
        const courses = await courseModel.find({});
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching courses' });
    }
});

module.exports = {
    courseRouter: courseRouter
}