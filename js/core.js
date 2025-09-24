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
            
            // Ensure path starts with /
            const cleanPath = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;
            return `${this.getBaseURL()}${cleanPath}`;
        },

        // Basic avatar update
        updateHeaderAvatar() {
            const headerAvatar = document.getElementById('headerAvatar');
            const headerUser = document.getElementById('headerUser');
            
            if (!headerAvatar) return;

            const user = this.getUser();
            const avatarUrl = this.getAvatarPath(user?.avatar);

            console.log('Updating header avatar:', user?.avatar || 'default');

            headerAvatar.src = avatarUrl;
            headerAvatar.onerror = () => {
                console.log('Header avatar failed to load, using default');
                
                // If user has invalid avatar, clear it and update localStorage
                if (user && user.avatar && !user.avatar.startsWith('http')) {
                    console.log('Clearing invalid avatar from localStorage');
                    user.avatar = '';
                    this.setUser(user);
                }
                
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

        // Clean localStorage and sync with server
        async cleanAndSyncUser() {
            try {
                const user = this.getUser();
                const token = this.getToken();
                
                if (!user || !token) return;
                
                // Check if avatar file actually exists
                if (user.avatar && user.avatar.startsWith('/uploads/')) {
                    try {
                        const response = await fetch(user.avatar, { method: 'HEAD' });
                        if (!response.ok) {
                            console.log('Avatar file not found, clearing from localStorage');
                            user.avatar = '';
                            this.setUser(user);
                            this.updateHeaderAvatar();
                        }
                    } catch (error) {
                        console.log('Avatar check failed, clearing from localStorage');
                        user.avatar = '';
                        this.setUser(user);
                        this.updateHeaderAvatar();
                    }
                }
                
                // Clear invalid avatar paths
                if (user.avatar && !user.avatar.startsWith('http') && !user.avatar.startsWith('/asset/') && !user.avatar.startsWith('/uploads/')) {
                    console.log('Detected invalid avatar format, clearing...');
                    user.avatar = '';
                    this.setUser(user);
                    this.updateHeaderAvatar();
                }
            } catch (error) {
                console.log('Avatar cleanup failed, will use default avatar');
            }
        },

        // Initialize core functionality
        init() {
            this.updateHeaderAvatar();
            this.initNavigation();
            this.initAvatarClick();
            this.cleanAndSyncUser(); // Auto-clean localStorage
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