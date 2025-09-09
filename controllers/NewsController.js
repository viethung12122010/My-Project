const News = require('../models/News');
const User = require('../models/User');

class NewsController {
    constructor() {
        this.newsModel = new News();
        this.userModel = new User();
    }

    async getAll(req, res) {
        try {
            const { page = 1, limit = 10, category } = req.query;
            const result = this.newsModel.getPaginated(page, limit, category);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    async getById(req, res) {
        try {
            const article = this.newsModel.findById(req.params.id);
            if (!article) {
                return res.status(404).json({ error: 'Không tìm thấy bài viết' });
            }
            res.json(article);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    async create(req, res) {
        try {
            const { title, summary, content, image, category } = req.body;
            
            if (!content) {
                return res.status(400).json({ error: 'Nội dung là bắt buộc' });
            }

            const user = this.userModel.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ error: 'Không tìm thấy user' });
            }

            const isAdmin = user.email === 'lviethung6a5@gmail.com' || user.id === 1;
            const authorName = isAdmin ? 'Admin' : (user.username || user.email);

            const articleData = {
                title,
                summary,
                content,
                image,
                category,
                author: authorName,
                authorId: user.id,
                authorAvatar: user.avatar
            };

            const article = this.newsModel.create(articleData);
            res.status(201).json(article);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    async update(req, res) {
        try {
            const { title, summary, content, image, category } = req.body;
            
            const article = this.newsModel.findById(req.params.id);
            if (!article) {
                return res.status(404).json({ error: 'Không tìm thấy bài viết' });
            }

            if (article.authorId !== req.user.id) {
                return res.status(403).json({ error: 'Bạn chỉ có thể sửa bài viết của mình' });
            }

            const updatedArticle = this.newsModel.update(req.params.id, {
                title, summary, content, image, category
            });

            res.json(updatedArticle);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    async delete(req, res) {
        try {
            const article = this.newsModel.findById(req.params.id);
            if (!article) {
                return res.status(404).json({ error: 'Không tìm thấy bài viết' });
            }

            const user = this.userModel.findById(req.user.id);
            const isAdmin = user && (user.email === 'lviethung6a5@gmail.com' || user.id === 1);

            if (article.authorId !== req.user.id && !isAdmin) {
                return res.status(403).json({ error: 'Bạn chỉ có thể xóa bài viết của mình' });
            }

            this.newsModel.delete(req.params.id);
            res.json({ message: 'Xóa bài viết thành công' });
        } catch (error) {
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
}

module.exports = NewsController;