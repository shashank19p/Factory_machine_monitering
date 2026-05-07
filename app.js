const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Setup Session
app.use(session({
    secret: 'factory_management_secret',
    resave: false,
    saveUninitialized: false
}));

// Provide user info to all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Import Routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const machinesRoutes = require('./routes/machines');

// Use Routes
app.use('/', authRoutes);
app.use('/users', usersRoutes);
app.use('/machines', machinesRoutes);

// Home Redirect
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

app.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    
    const role = req.session.user.role;
    if (role === 'admin') res.redirect('/users/admin');
    else if (role === 'worker') res.redirect('/machines/worker');
    else if (role === 'engineer') res.redirect('/machines/engineer');
    else res.redirect('/login');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
