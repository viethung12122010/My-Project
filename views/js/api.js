// API Helper functions
class API {
    static baseURL = '';

    static async request(url, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(this.baseURL + url, {
                ...options,
                headers
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Có lỗi xảy ra');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth methods
    static async signup(userData) {
        return this.request('/api/signup', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    static async signin(credentials) {
        return this.request('/api/signin', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    static async getProfile() {
        return this.request('/api/profile');
    }

    static async uploadAvatar(file) {
        const formData = new FormData();
        formData.append('avatar', file);

        const token = localStorage.getItem('token');
        return fetch('/api/upload-avatar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        }).then(res => res.json());
    }

    // News methods
    static async getNews(page = 1, limit = 10, category = null) {
        let url = `/api/news?page=${page}&limit=${limit}`;
        if (category) url += `&category=${category}`;
        return this.request(url);
    }

    static async getNewsById(id) {
        return this.request(`/api/news/${id}`);
    }

    static async createNews(newsData) {
        return this.request('/api/news', {
            method: 'POST',
            body: JSON.stringify(newsData)
        });
    }

    static async updateNews(id, newsData) {
        return this.request(`/api/news/${id}`, {
            method: 'PUT',
            body: JSON.stringify(newsData)
        });
    }

    static async deleteNews(id) {
        return this.request(`/api/news/${id}`, {
            method: 'DELETE'
        });
    }

    // Exam methods
    static async getExams() {
        return this.request('/api/exams');
    }

    static async getExamById(id) {
        return this.request(`/api/exams/${id}`);
    }
}

// Auth helper functions
function saveAuthData(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
}

function getAuthData() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return {
        token,
        user: user ? JSON.parse(user) : null
    };
}

function clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

function isAuthenticated() {
    return !!localStorage.getItem('token');
}