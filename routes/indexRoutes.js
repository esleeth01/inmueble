// indexRoutes.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/politicas', (req, res) => {
    res.render('politicas');
});

module.exports = router;
