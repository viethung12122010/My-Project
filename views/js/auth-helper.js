// Auth Helper - Quản lý thông tin người dùng mà không dùng localStorage
class AuthHelper {
    static currentUser = null;
    
    // Lấy thông tin user từ server
    static async getCurrentUser() {
        if (this.currentUser) {
            return this.currentUser;
        }
        
        try {
            const response = await API.getProfile();
            this.currentUser = response.user;
            return this.currentUser;
        } catch (error) {
            console.error('Lỗi khi lấy thông tin user:', error);
            return null;
        }
    }
    
    // Kiểm tra xem user đã đăng nhập chưa
    static async isAuthenticated() {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        try {
            const user = await this.getCurrentUser();
            return !!user;
        } catch (error) {
            return false;
        }
    }
    
    // Đăng xuất
    static logout() {
        localStorage.removeItem('token');
        this.currentUser = null;
        window.location.href = '/signin';
    }
    
    // Cập nhật thông tin user trong cache
    static updateCurrentUser(userData) {
        if (this.currentUser) {
            this.currentUser = { ...this.currentUser, ...userData };
        }
    }
    
    // Xóa cache user (dùng khi cần refresh thông tin)
    static clearUserCache() {
        this.currentUser = null;
    }
}