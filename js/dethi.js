// Dethi page JavaScript functionality

const DETHI_STORAGE_KEY = 'dethiExercises';

function getDethiExercises() {
    const storedExercises = localStorage.getItem(DETHI_STORAGE_KEY);
    if (storedExercises) {
        return JSON.parse(storedExercises);
    }

    let exercises = [
        {
            id: 'dethi-khtn-1',
            title: 'KHTN 2009-2010 v1',
            summary: 'Đề thi KHTN 2009-2010',
            image: '../asset/image/Dethi/KHTN/KHTN_2009-2010_v1.jpg',
        },
        {
            id: 'dethi-khtn-2',
            title: 'KHTN 2009-2010 v2',
            summary: 'Đề thi KHTN 2009-2010',
            image: '../asset/image/Dethi/KHTN/KHTN_2009-2010_v2.jpg',
        },
        {
            id: 'dethi-khtn-3',
            title: 'KHTN 2010-2011 v1',
            summary: 'Đề thi KHTN 2010-2011',
            image: '../asset/image/Dethi/KHTN/KHTN_2010-2011_v1.jpg',
        },
        {
            id: 'dethi-khtn-4',
            title: 'KHTN 2010-2011 v2',
            summary: 'Đề thi KHTN 2010-2011',
            image: '../asset/image/Dethi/KHTN/KHTN_2010-2011_v2.jpg',
        },
        {
            id: 'dethi-khtn-5',
            title: 'KHTN 2011-2012 v1',
            summary: 'Đề thi KHTN 2011-2012',
            image: '../asset/image/Dethi/KHTN/KHTN_2011-2012_v1.jpg',
        },
        {
            id: 'dethi-khtn-6',
            title: 'KHTN 2011-2012 v2',
            summary: 'Đề thi KHTN 2011-2012',
            image: '../asset/image/Dethi/KHTN/KHTN_2011-2012_v2.jpg',
        },
        {
            id: 'dethi-khtn-7',
            title: 'KHTN 2012-2013 v1',
            summary: 'Đề thi KHTN 2012-2013',
            image: '../asset/image/Dethi/KHTN/KHTN_2012-2013_v1.jpg',
        },
        {
            id: 'dethi-khtn-8',
            title: 'KHTN 2012-2013 v2',
            summary: 'Đề thi KHTN 2012-2013',
            image: '../asset/image/Dethi/KHTN/KHTN_2012-2013_v2.jpg',
        },
        {
            id: 'dethi-khtn-9',
            title: 'KHTN 2018-2019 V1',
            summary: 'Đề thi KHTN 2018-2019',
            image: '../asset/image/Dethi/KHTN/KHTN_2018-2019_V1.jpg',
        },
        {
            id: 'dethi-khtn-10',
            title: 'KHTN 2018-2019 V2',
            summary: 'Đề thi KHTN 2018-2019',
            image: '../asset/image/Dethi/KHTN/KHTN_2018-2019_V2.jpg',
        },
        {
            id: 'dethi-khtn-11',
            title: 'KHTN 2019-2020 v1',
            summary: 'Đề thi KHTN 2019-2020',
            image: '../asset/image/Dethi/KHTN/KHTN_2019-2020_v1.jpg',
        },
        {
            id: 'dethi-khtn-12',
            title: 'KHTN 2019-2020 v2',
            summary: 'Đề thi KHTN 2019-2020',
            image: '../asset/image/Dethi/KHTN/KHTN_2019-2020_v2.jpg',
        },
        {
            id: 'dethi-lim-1',
            title: 'Lim dot 2 1',
            summary: 'Đề thi khảo sát tại CLB Lim',
            image: '../asset/image/Dethi/Lim/Lim_dot_2_1.jpg',
        },
        {
            id: 'dethi-lim-2',
            title: 'Lim KT 2',
            summary: 'Đề thi khảo sát tại CLB Lim',
            image: '../asset/image/Dethi/Lim/Lim_KT_2.jpg',
        },
        {
            id: 'dethi-lim-3',
            title: 'Lim KT 3',
            summary: 'Đề thi khảo sát tại CLB Lim',
            image: '../asset/image/Dethi/Lim/Lim_KT_3.jpg',
        }
    ];

    const rarities = ['Mythical', 'Legendary', 'Rare', 'Uncommon', 'Common'];
    exercises.forEach(ex => {
        ex.difficulty = rarities[Math.floor(Math.random() * rarities.length)];
    });

    localStorage.setItem(DETHI_STORAGE_KEY, JSON.stringify(exercises));
    return exercises;
}

function renderDethiCards() {
    console.log('=== Starting renderDethiCards ===');
    
    const cardsRoot = document.getElementById('cards');
    console.log('Cards container:', cardsRoot);
    
    if (!cardsRoot) {
        console.error('Cards container not found!');
        return;
    }

    // Clear existing content
    cardsRoot.innerHTML = '';
    
    const exercises = getDethiExercises();
    console.log('Got exercises:', exercises.length);
    
    if (exercises.length === 0) {
        cardsRoot.innerHTML = '<p>Không có đề thi nào!</p>';
        return;
    }

    // Create cards directly with simple HTML
    exercises.forEach((ex, index) => {
        console.log(`Creating card ${index + 1}:`, ex.title);
        
        const card = document.createElement('div');
        card.className = 'exercise-card';
        card.style.cssText = `
            border: 2px solid #ddd;
            border-radius: 12px;
            padding: 15px;
            margin: 10px;
            background: white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-block;
            width: 280px;
            vertical-align: top;
        `;
        
        card.innerHTML = `
            <div style="text-align: center; margin-bottom: 10px;">
                <img src="${ex.image}" alt="${ex.title}" 
                     style="width: 100%; max-width: 250px; height: 180px; object-fit: cover; border-radius: 8px;"
                     onerror="this.style.background='#f0f0f0'; this.style.color='#666'; this.innerHTML='Ảnh không tải được';">
            </div>
            <div style="background: #007bff; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px; display: inline-block; margin-bottom: 10px;">
                ${ex.difficulty || 'Normal'}
            </div>
            <h3 style="color: #333; font-size: 16px; margin: 10px 0; font-weight: bold;">
                ${ex.title}
            </h3>
            <p style="color: #666; font-size: 14px; margin: 10px 0; line-height: 1.4;">
                ${ex.summary}
            </p>
            <div style="margin-top: 15px;">
                <button onclick="viewImage('${ex.image}', '${ex.title}')" 
                        style="background: #28a745; color: white; border: none; padding: 8px 15px; border-radius: 5px; margin-right: 5px; cursor: pointer;">
                    📖 Mở Đề
                </button>
                <button onclick="viewImage('${ex.image}', '${ex.title}')" 
                        style="background: #17a2b8; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                    👁️ Xem Ảnh
                </button>
            </div>
        `;
        
        // Add hover effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        });
        
        cardsRoot.appendChild(card);
    });
    
    console.log('=== Finished rendering cards ===');
}

// Global function to view images
function viewImage(imageSrc, title) {
    window.open(imageSrc, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Dethi page DOM loaded');
    
    // Force clear localStorage for fresh start
    localStorage.removeItem('dethiExercises');
    console.log('Cleared localStorage');
    
    if (typeof CommonJS !== 'undefined') {
        CommonJS.initializeCommon();
    } else {
        console.log('CommonJS not available, initializing basic functionality');
        initializeUser();
        initializeNavigation();
    }
    
    console.log('About to render dethi cards');
    renderDethiCards();
    console.log('✅ Dethi cards rendering completed');
});

// Fallback functions if CommonJS is not loaded
function initializeUser() {
    const headerUser = document.getElementById('headerUser');
    if (headerUser) {
        const user = JSON.parse(localStorage.getItem('current_user') || 'null');
        headerUser.textContent = user ? (user.email || user.username || 'User') : 'Guest';
    }
}

function initializeNavigation() {
    const navMenuButton = document.getElementById('navMenuButton');
    const navOverlay = document.getElementById('navOverlay');
    const closeNavButton = document.getElementById('closeNavButton');

    if (navMenuButton && navOverlay) {
        navMenuButton.addEventListener('click', () => navOverlay.classList.add('show'));
    }
    if (closeNavButton && navOverlay) {
        closeNavButton.addEventListener('click', () => navOverlay.classList.remove('show'));
    }
}

// Fallback modal function
function showImageInModal(imgSrc, title, desc) {
    if (typeof CommonJS !== 'undefined' && CommonJS.showImageInModal) {
        CommonJS.showImageInModal(imgSrc, title, desc);
        return;
    }
    
    // Simple fallback - open image in new window
    const images = Array.isArray(imgSrc) ? imgSrc : [imgSrc];
    images.forEach(src => {
        window.open(src, '_blank');
    });
}