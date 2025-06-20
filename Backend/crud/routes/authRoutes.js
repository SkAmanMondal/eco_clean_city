const express = require('express');
const router = express.Router();
const {registeruser,loginuser,getme} = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/register',registeruser);
router.post('/login',loginuser);
router.get('/me',protect,getme);

module.exports = router;