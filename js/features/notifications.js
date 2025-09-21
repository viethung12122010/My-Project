// Notification features - lazy loaded
(function() {
    'use strict';

    const Notifications = {
        async loadCount() {
            try {
                const response = await fetch('http://localhost:9000/api/news?category=Log&limit=100');
                const data = await response.json();
                
                if (data.news) {
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    
                    const recentAdminPosts = data.news.filter(post => {
                        const isAdmin = post.author === 'Admin' || post.authorId === 1;
                        const postDate = new Date(post.createdAt);
                        return isAdmin && postDate > sevenDaysAgo;
                    });
                    
                    this.updateCount(recentAdminPosts.length);
                }
            } catch (error) {
                console.warn('Failed to load notification count:', error);
            }
        },

        updateCount(count) {
            const mainCount = document.getElementById('notificationCount');
            const headerCount = document.getElementById('headerNotificationCount');
            
            if (mainCount) {
                mainCount.textContent = count;
                mainCount.style.display = count > 0 ? 'inline' : 'none';
            }
            
            if (headerCount) {
                headerCount.textContent = count;
                headerCount.className = count > 0 ? 'notification-badge' : 'notification-badge hidden';
            }
        }
    };

    // Export
    window.Notifications = Notifications;
})();