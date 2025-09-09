const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
    constructor() {
        this.userModel = new User();
        this.JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
    }

    generateToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email }, 
            this.JWT_SECRET, 
            { expiresIn: '7d' }
        );
    }

    async signup(req, res) {
        try {
            const { username, email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ error: 'Email và password là bắt buộc' });
            }

            if (this.userModel.findByEmail(email)) {
                return res.status(400).json({ error: 'Email đã tồn tại' });
            }

            const user = this.userModel.create({ username, email, password });
            const safeUser = { 
                id: user.id, 
                username: user.username, 
                email: user.email, 
                avatar: user.avatar 
            };

            res.status(201).json({ 
                user: safeUser, 
                token: this.generateToken(safeUser) 
            });
        } catch (error) {
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    async signin(req, res) {
        try {
            const { email, password } = req.body;
            
            const user = this.userModel.findByEmail(email);
            if (!user) {
                return res.status(400).json({ error: 'Email hoặc password không đúng' });
            }

            const isValidPassword = this.userModel.verifyPassword(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ error: 'Email hoặc password không đúng' });
            }

            const safeUser = { 
                id: user.id, 
                username: user.username, 
                email: user.email, 
                avatar: user.avatar 
            };

            res.json({ 
                user: safeUser, 
                token: this.generateToken(safeUser) 
            });
        } catch (error) {
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    authenticate(req, res, next) {
        const header = req.headers.authorization;
        if (!header) {
            return res.status(401).json({ error: 'Không có token' });
        }

        const parts = header.split(' ');
        if (parts.length !== 2) {
            return res.status(401).json({ error: 'Token không hợp lệ' });
        }

        try {
            const payload = jwt.verify(parts[1], this.JWT_SECRET);
            req.user = payload;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Token không hợp lệ' });
        }
    }
}

module.exports = AuthController;