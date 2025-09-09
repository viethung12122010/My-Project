const fs = require('fs');
const path = require('path');

class News {
    constructor() {
        this.dbPath = path.join(__dirname, '../db/news.json');
        this.ensureDbExists();
    }

    ensureDbExists() {
        const dbDir = path.dirname(this.dbPath);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }
        if (!fs.existsSync(this.dbPath)) {
            this.seedData();
        }
    }

    seedData() {
        const defaultNews = [
            {
                id: 1,
                title: 'Log Post',
                summary: 'Chào mừng đến với My Project Log! Đây là nơi mình sẽ chia sẻ những cập nhật, suy nghĩ và thông báo về dự án.',
                content: `Chào mừng đến với My Project Log! 🎉\n\nĐây là nơi mình sẽ chia sẻ những cập nhật, suy nghĩ và thông báo về dự án. Các bạn có thể theo dõi để biết:\n\n• Tính năng mới được thêm vào\n• Cập nhật và sửa lỗi\n• Chia sẻ về quá trình phát triển\n• Thông báo quan trọng\n\nCảm ơn các bạn đã quan tâm và ủng hộ My Project! 💪`,
                image: '',
                category: 'Log',
                author: 'Admin',
                authorId: 1,
                authorAvatar: '/asset/image/Material/bg_pc.jpg',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        fs.writeFileSync(this.dbPath, JSON.stringify(defaultNews, null, 2));
    }

    getAll() {
        try {
            const data = fs.readFileSync(this.dbPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    save(news) {
        fs.writeFileSync(this.dbPath, JSON.stringify(news, null, 2));
    }

    findById(id) {
        const news = this.getAll();
        return news.find(article => article.id === parseInt(id));
    }

    create(articleData) {
        const news = this.getAll();
        const id = news.length ? Math.max(...news.map(n => n.id)) + 1 : 1;
        
        const article = {
            id,
            title: articleData.title || 'Log Post',
            summary: articleData.summary || articleData.content.substring(0, 150) + (articleData.content.length > 150 ? '...' : ''),
            content: articleData.content,
            image: articleData.image || '',
            category: articleData.category || 'Log',
            author: articleData.author,
            authorId: articleData.authorId,
            authorAvatar: articleData.authorAvatar || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        news.push(article);
        this.save(news);
        return article;
    }

    update(id, articleData) {
        const news = this.getAll();
        const index = news.findIndex(article => article.id === parseInt(id));
        
        if (index !== -1) {
            news[index] = { 
                ...news[index], 
                ...articleData,
                updatedAt: new Date().toISOString()
            };
            this.save(news);
            return news[index];
        }
        return null;
    }

    delete(id) {
        const news = this.getAll();
        const index = news.findIndex(article => article.id === parseInt(id));
        
        if (index !== -1) {
            const deleted = news.splice(index, 1);
            this.save(news);
            return deleted[0];
        }
        return null;
    }

    getPaginated(page = 1, limit = 10, category = null) {
        let news = this.getAll();
        
        if (category) {
            news = news.filter(n => n.category === category);
        }
        
        news.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedNews = news.slice(startIndex, endIndex);
        
        return {
            news: paginatedNews,
            total: news.length,
            page: parseInt(page),
            totalPages: Math.ceil(news.length / limit)
        };
    }
}

module.exports = News;