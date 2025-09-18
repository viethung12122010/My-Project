// Common JavaScript functionality for all pages

// User management functions
function initializeUser() {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    const headerAvatar = document.getElementById('headerAvatar');
    const headerUser = document.getElementById('headerUser');
    const avatarWrap = document.getElementById('avatarWrap');
    
    if (currentUser && headerAvatar && headerUser) {
        headerAvatar.src = currentUser.avatar || '../asset/image/Material/user.jpg';
        headerUser.textContent = currentUser.email || 'Guest';
    }
    
    if (avatarWrap) {
        avatarWrap.addEventListener('click', () => {
            window.location.href = currentUser ? 'profile.html' : 'sign_up.html';
        });
    }
    
    return currentUser;
}

// Navigation overlay functions
function initializeNavigation() {
    const navMenuButton = document.getElementById('navMenuButton');
    const navOverlay = document.getElementById('navOverlay');
    const closeNavButton = document.getElementById('closeNavButton');

    if (navMenuButton) {
        navMenuButton.addEventListener('click', () => {
            navOverlay.classList.add('show');
        });
    }

    if (closeNavButton) {
        closeNavButton.addEventListener('click', () => {
            navOverlay.classList.remove('show');
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', (e) => {
            if (e.target === navOverlay) {
                navOverlay.classList.remove('show');
            }
        });
    }
}

// Notification functions
async function loadNotificationCount() {
    try {
        const response = await fetch('/api/news?category=Log&limit=100');
        const data = await response.json();
        
        if (data.news) {
            // Count admin posts from last 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            
            const recentAdminPosts = data.news.filter(post => {
                const isAdmin = post.author === 'Admin' || post.authorId === 1;
                const postDate = new Date(post.createdAt);
                return isAdmin && postDate > sevenDaysAgo;
            });
            
            const count = recentAdminPosts.length;
            updateNotificationCount(count);
        }
    } catch (error) {
        console.error('Error loading notification count:', error);
    }
}

function updateNotificationCount(count) {
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

// Modal functions for image viewing
function showImageInModal(imgSrc, title, desc) {
    const container = document.getElementById('viewImageModalImagesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    const images = Array.isArray(imgSrc) ? imgSrc : [imgSrc];
    
    images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = title;
        img.style.width = "100%";
        img.style.marginBottom = "10px";
        container.appendChild(img);
    });

    const titleElement = document.getElementById('viewImageModalTitle');
    const descElement = document.getElementById('viewImageModalDesc');
    
    if (titleElement) titleElement.innerText = title;
    if (descElement) descElement.innerText = desc;
    
    const modal = new bootstrap.Modal(document.getElementById('viewImageModal'));
    modal.show();
}

// Initialize common functionality
function initializeCommon() {
    initializeUser();
    initializeNavigation();
    loadNotificationCount();
}

// Export functions for use in other files
window.CommonJS = {
    initializeUser,
    initializeNavigation,
    loadNotificationCount,
    updateNotificationCount,
    showImageInModal,
    initializeCommon
};