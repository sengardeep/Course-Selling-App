const { Router } = require('express');
const { courseModel, purchaseModel } = require('../db');
const {userMiddleware} = require('../middleware/user');
const courseRouter = Router();

courseRouter.post('/purchase', userMiddleware, async (req, res) => {
    const { courseId } = req.body;
    const userId = req.userId;

    try {
        // Check if course exists
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check if user already purchased this course
        const existingPurchase = await purchaseModel.findOne({
            userId: userId,
            courseId: courseId
        });

        if (existingPurchase) {
            return res.status(400).json({ error: 'You have already purchased this course' });
        }

        // Create purchase
        const purchase = await purchaseModel.create({
            userId: userId,
            courseId: courseId
        });

        res.status(201).json({
            message: 'Course purchased successfully',
            purchase: purchase
        });
    } catch (error) {
        console.error('Purchase error:', error);
        res.status(500).json({ error: 'Internal server error during purchase' });
    }
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