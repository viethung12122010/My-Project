const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

class User {
    constructor() {
        this.dbPath = path.join(__dirname, '../db/users.json');
        this.ensureDbExists();
    }

    ensureDbExists() {
        const dbDir = path.dirname(this.dbPath);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }
        if (!fs.existsSync(this.dbPath)) {
            fs.writeFileSync(this.dbPath, JSON.stringify([], null, 2));
        }
    }

    getAll() {
        try {
            const data = fs.readFileSync(this.dbPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    save(users) {
        fs.writeFileSync(this.dbPath, JSON.stringify(users, null, 2));
    }

    findByEmail(email) {
        const users = this.getAll();
        return users.find(user => user.email === email);
    }

    findById(id) {
        const users = this.getAll();
        return users.find(user => user.id === id);
    }

    create(userData) {
        const users = this.getAll();
        const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
        
        const user = {
            id,
            username: userData.username || '',
            email: userData.email,
            password: bcrypt.hashSync(userData.password, 8),
            avatar: userData.avatar || ''
        };

        users.push(user);
        this.save(users);
        return user;
    }

    update(id, userData) {
        const users = this.getAll();
        const index = users.findIndex(user => user.id === id);
        
        if (index !== -1) {
            users[index] = { ...users[index], ...userData };
            this.save(users);
            return users[index];
        }
        return null;
    }

    verifyPassword(password, hashedPassword) {
        return bcrypt.compareSync(password, hashedPassword);
    }
}

module.exports = User;