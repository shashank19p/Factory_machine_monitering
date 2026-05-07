const express = require('express');
const router = express.Router();
const db = require('../db');

const requireLogin = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
};

// -- WORKER ROUTES --

// Worker Dashboard
router.get('/worker', requireLogin, async (req, res) => {
    if (req.session.user.role !== 'worker') return res.status(403).send('Forbidden');

    try {
        const [machines] = await db.query('SELECT * FROM Machines');
        const [engineers] = await db.query('SELECT * FROM Users WHERE role = "engineer"');
        const assignedMachines = machines.filter(m => m.assigned_worker_id === req.session.user.user_id);
        res.render('worker', { machines, assignedMachines, engineers, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

// Mark machine as damaged (Maintenance)
router.post('/mark-damaged/:id', requireLogin, async (req, res) => {
    if (req.session.user.role !== 'worker') return res.status(403).send('Forbidden');
    
    try {
        await db.query('UPDATE Machines SET status = "Maintenance" WHERE machine_id = ?', [req.params.id]);
        res.redirect('/machines/worker');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

// Assign Engineer
router.post('/assign-engineer/:id', requireLogin, async (req, res) => {
    if (req.session.user.role !== 'worker') return res.status(403).send('Forbidden');
    
    const { engineer_id } = req.body;
    const worker_id = req.session.user.user_id;

    try {
        await db.query(
            'UPDATE Machines SET assigned_engineer_id = ?, assigned_worker_id = ?, work_status = "Assigned" WHERE machine_id = ?', 
            [engineer_id, worker_id, req.params.id]
        );
        res.redirect('/machines/worker');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});


// Worker Bulk Mark Done
router.post('/worker/mark-done', requireLogin, async (req, res) => {
    if (req.session.user.role !== 'worker') return res.status(403).send('Forbidden');
    
    let { machine_ids } = req.body;
    if (!machine_ids) return res.redirect('/machines/worker');
    if (!Array.isArray(machine_ids)) machine_ids = [machine_ids];

    try {
        if (machine_ids.length > 0) {
            const placeholders = machine_ids.map(() => '?').join(',');
            await db.query(
                `UPDATE Machines SET assigned_worker_id = NULL WHERE machine_id IN (${placeholders})`, 
                machine_ids
            );
        }
        res.redirect('/machines/worker');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});


// -- ENGINEER ROUTES --

// Engineer Dashboard
router.get('/engineer', requireLogin, async (req, res) => {
    if (req.session.user.role !== 'engineer') return res.status(403).send('Forbidden');

    try {
        // Fetch machines assigned to this engineer
        const [machines] = await db.query('SELECT * FROM Machines WHERE assigned_engineer_id = ?', [req.session.user.user_id]);
        res.render('engineer', { machines, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

// Engineer Starts Work
router.post('/engineer/start-work/:id', requireLogin, async (req, res) => {
    if (req.session.user.role !== 'engineer') return res.status(403).send('Forbidden');
    
    try {
        await db.query('UPDATE Machines SET work_status = "In Progress" WHERE machine_id = ? AND assigned_engineer_id = ?', [req.params.id, req.session.user.user_id]);
        res.redirect('/machines/engineer');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

// Update Status to Running (Legacy per-machine basis, keeping for fallback)
router.post('/mark-running/:id', requireLogin, async (req, res) => {
    if (req.session.user.role !== 'engineer') return res.status(403).send('Forbidden');
    
    try {
        await db.query('UPDATE Machines SET status = "Running", work_status = "Completed", assigned_engineer_id = NULL WHERE machine_id = ?', [req.params.id]);
        res.redirect('/machines/engineer');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

// Engineer Bulk Mark Done
router.post('/engineer/mark-done', requireLogin, async (req, res) => {
    if (req.session.user.role !== 'engineer') return res.status(403).send('Forbidden');
    
    let { machine_ids } = req.body;
    if (!machine_ids) return res.redirect('/machines/engineer');
    if (!Array.isArray(machine_ids)) machine_ids = [machine_ids];

    try {
        if (machine_ids.length > 0) {
            const placeholders = machine_ids.map(() => '?').join(',');
            await db.query(
                `UPDATE Machines SET status = 'Running', work_status = 'Completed', assigned_engineer_id = NULL WHERE machine_id IN (${placeholders})`, 
                machine_ids
            );
        }
        res.redirect('/machines/engineer');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

module.exports = router;
