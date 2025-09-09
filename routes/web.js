const express = require('express');
const router = express.Router();
const WebController = require('../controllers/WebController');

const webController = new WebController();

// Trang chủ
router.get('/', webController.home);

// Các trang chính
router.get('/home', webController.home);
router.get('/signin', webController.signin);
router.get('/signup', webController.signup);
router.get('/profile', webController.profile);

router.get('/sohoc', webController.sohoc);
router.get('/pt', webController.pt);
router.get('/dethi', webController.dethi);

module.exports = router;