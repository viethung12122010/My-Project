// Configuration for API endpoints
const CONFIG = {
    // Tự động detect API base URL dựa trên environment
    getApiBaseUrl() {
        // Nếu đang chạy local development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return `http://${window.location.hostname}:3001`;
        }
        // Nếu đang chạy trên production (Vercel, Netlify, etc.)
        return window.location.origin;
    },
    
    // API endpoints
    API: {
        SIGNIN: '/api/signin',
        SIGNUP: '/api/signup', 
        PROFILE: '/api/profile',
        UPLOAD_AVATAR: '/api/upload-avatar',
        NEWS: '/api/news',
        EXAMS: '/api/exams'
    }
};

// Helper function để tạo full URL
function getApiUrl(endpoint) {
    return CONFIG.getApiBaseUrl() + endpoint;
}

// Export cho sử dụng global
window.CONFIG = CONFIG;
window.getApiUrl = getApiUrl;