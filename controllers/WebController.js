const path = require('path');

class WebController {
    // Trang chủ
    home(req, res) {
        res.sendFile(path.join(__dirname, '../views/web.html'));
    }

    // Trang đăng nhập
    signin(req, res) {
        res.sendFile(path.join(__dirname, '../views/sign_in.html'));
    }

    // Trang đăng ký
    signup(req, res) {
        res.sendFile(path.join(__dirname, '../views/sign_up.html'));
    }

    // Trang profile
    profile(req, res) {
        res.sendFile(path.join(__dirname, '../views/profile.html'));
    }

    

    // Trang số học
    sohoc(req, res) {
        res.sendFile(path.join(__dirname, '../views/Sohoc.html'));
    }

    // Trang phương trình
    pt(req, res) {
        res.sendFile(path.join(__dirname, '../views/Pt.html'));
    }

    // Trang đề thi
    dethi(req, res) {
        res.sendFile(path.join(__dirname, '../views/Dethi.html'));
    }
}

module.exports = WebController;