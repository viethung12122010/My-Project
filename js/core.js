// Core functionality - loaded on all pages
(function() {
    'use strict';

    // Core utilities
    const Core = {
        // Base URL helper
        getBaseURL() {
            return window.location.origin;
        },

        // Local storage helpers
        getUser() {
            try {
                return JSON.parse(localStorage.getItem('current_user'));
            } catch {
                return null;
            }
        },

        setUser(user) {
            localStorage.setItem('current_user', JSON.stringify(user));
        },

        getToken() {
            return localStorage.getItem('token');
        },

        setToken(token) {
            localStorage.setItem('token', token);
        },

        // Avatar path helper
        getAvatarPath(avatarPath) {
            if (!avatarPath) {
                return window.location.pathname.includes('/html/') 
                    ? '../asset/image/Material/user.jpg'
                    : 'asset/image/Material/user.jpg';
            }
            
            if (avatarPath.startsWith('http')) {
                return avatarPath;
            }
            
            return `${this.getBaseURL()}${avatarPath}`;
        },

        // Basic avatar update
        updateHeaderAvatar() {
            const headerAvatar = document.getElementById('headerAvatar');
            const headerUser = document.getElementById('headerUser');
            
            if (!headerAvatar) return;

            const user = this.getUser();
            const avatarUrl = this.getAvatarPath(user?.avatar);

            headerAvatar.src = avatarUrl;
            headerAvatar.onerror = () => {
                headerAvatar.src = window.location.pathname.includes('/html/') 
                    ? '../asset/image/Material/user.jpg'
                    : 'asset/image/Material/user.jpg';
            };

            if (headerUser) {
                headerUser.textContent = user ? (user.email || user.username || 'User') : 'Guest';
            }
        },

        // Basic navigation
        initNavigation() {
            const navMenuButton = document.getElementById('navMenuButton');
            const navOverlay = document.getElementById('navOverlay');
            const closeNavButton = document.getElementById('closeNavButton');

            if (navMenuButton && navOverlay) {
                navMenuButton.addEventListener('click', () => {
                    navOverlay.classList.add('show');
                });
            }

            if (closeNavButton && navOverlay) {
                closeNavButton.addEventListener('click', () => {
                    navOverlay.classList.remove('show');
                });

                navOverlay.addEventListener('click', (e) => {
                    if (e.target === navOverlay) {
                        navOverlay.classList.remove('show');
                    }
                });
            }
        },

        // Avatar click handler
        initAvatarClick() {
            const avatarWrap = document.getElementById('avatarWrap');
            if (avatarWrap) {
                avatarWrap.addEventListener('click', () => {
                    const user = this.getUser();
                    window.location.href = user ? '/html/profile.html' : '/html/sign_up.html';
                });
            }
        },

        // Initialize core functionality
        init() {
            this.updateHeaderAvatar();
            this.initNavigation();
            this.initAvatarClick();
        }
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Core.init());
    } else {
        Core.init();
    }

    // Export to global scope
    window.Core = Core;
})();