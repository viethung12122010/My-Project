const Exam = require('../models/Exam');

class ExamController {
    constructor() {
        this.examModel = new Exam();
    }

    async getAll(req, res) {
        try {
            const exams = this.examModel.getAll();
            const examList = exams.map(e => ({
                id: e.id,
                title: e.title,
                summary: e.summary,
                image: e.image
            }));
            res.json(examList);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    async getById(req, res) {
        try {
            const exam = this.examModel.findById(req.params.id);
            if (!exam) {
                return res.status(404).json({ error: 'Không tìm thấy đề thi' });
            }
            res.json(exam);
        } catch (error) {
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
}

module.exports = ExamController;