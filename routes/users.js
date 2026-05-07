const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to check if user is logged in
const requireLogin = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
};

// Admin dashboard - View all users and machines
router.get('/admin', requireLogin, async (req, res) => {
    if (req.session.user.role !== 'admin') return res.status(403).send('Forbidden');

    try {
        const [users] = await db.query('SELECT * FROM Users WHERE role != "admin"');
        const [machines] = await db.query(`
            SELECT m.*, 
                   w.name AS worker_name, 
                   e.name AS engineer_name
            FROM Machines m
            LEFT JOIN Users w ON m.assigned_worker_id = w.user_id
            LEFT JOIN Users e ON m.assigned_engineer_id = e.user_id
        `);
        res.render('admin', { users, machines, error: null });
    } catch (err) {
        console.error(err);
        res.render('admin', { users: [], machines: [], error: 'Failed to load data.' });
    }
});

module.exports = router;
