const fs = require('fs');
const path = require('path');

class Exam {
    constructor() {
        this.dbPath = path.join(__dirname, '../db/exams.json');
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
        const defaultExams = [
            { 
                id: 1, 
                title: 'KHTN 2009 V1', 
                summary: 'Đề thi Khoa học Tự nhiên 2009 - Phiên bản 1', 
                image: '/asset/image/Dethi/KHTN/KHTN_2009-2010_v1.jpg' 
            },
            { 
                id: 2, 
                title: 'KHTN 2009 V2', 
                summary: 'Đề thi Khoa học Tự nhiên 2009 - Phiên bản 2', 
                image: '/asset/image/Dethi/KHTN/KHTN_2009-2010_v2.jpg' 
            }
        ];
        fs.writeFileSync(this.dbPath, JSON.stringify(defaultExams, null, 2));
    }

    getAll() {
        try {
            const data = fs.readFileSync(this.dbPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    save(exams) {
        fs.writeFileSync(this.dbPath, JSON.stringify(exams, null, 2));
    }

    findById(id) {
        const exams = this.getAll();
        return exams.find(exam => exam.id === parseInt(id));
    }

    create(examData) {
        const exams = this.getAll();
        const id = exams.length ? Math.max(...exams.map(e => e.id)) + 1 : 1;
        
        const exam = {
            id,
            title: examData.title,
            summary: examData.summary,
            image: examData.image || ''
        };

        exams.push(exam);
        this.save(exams);
        return exam;
    }
}

module.exports = Exam;