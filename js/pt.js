// Pt page JavaScript functionality

const PT_STORAGE_KEY = 'ptExercises';

function getPtExercises() {
    const storedExercises = localStorage.getItem(PT_STORAGE_KEY);
    if (storedExercises) {
        return JSON.parse(storedExercises);
    }

    let exercises = [
        {
            id: 'pt-1',
            title: 'Phương trình - PT1_1',
            summary: 'Các bài toán về phương trình',
            image: '../asset/image/PT-HPT/PT/PT1_1.jpg',
        },
        {
            id: 'pt-2',
            title: 'Phương trình - PT1_2',
            summary: 'Các bài toán về phương trình',
            image: '../asset/image/PT-HPT/PT/PT1_2.jpg',
        },
        {
            id: 'pt-3',
            title: 'Phương trình - PT2',
            summary: 'Các bài toán về phương trình',
            image: '../asset/image/PT-HPT/PT/PT2.jpg',
        },
        {
            id: 'hpt-1',
            title: 'Hệ Phương trình - HPT1',
            summary: 'Các bài toán về hệ phương trình',
            image: '../asset/image/PT-HPT/HPT/HPT1.jpg',
        },
        {
            id: 'hpt-2',
            title: 'Hệ Phương trình - HPT2',
            summary: 'Các bài toán về hệ phương trình',
            image: '../asset/image/PT-HPT/HPT/HPT2.jpg',
        },
        {
            id: 'hpt-3',
            title: 'Hệ Phương trình - HPT3',
            summary: 'Các bài toán về hệ phương trình',
            image: '../asset/image/PT-HPT/HPT/HPT3.jpg',
        }
    ];

    const rarities = ['Mythical', 'Legendary', 'Rare', 'Uncommon', 'Common'];
    exercises.forEach(ex => {
        ex.difficulty = rarities[Math.floor(Math.random() * rarities.length)];
    });

    localStorage.setItem(PT_STORAGE_KEY, JSON.stringify(exercises));
    return exercises;
}

function renderPtCards() {
    console.log('=== Starting renderPtCards ===');
    
    const cardsRoot = document.getElementById('cards');
    console.log('Cards container:', cardsRoot);
    
    if (!cardsRoot) {
        console.error('Cards container not found!');
        return;
    }

    // Clear existing content
    cardsRoot.innerHTML = '';
    
    // Force fresh data
    localStorage.removeItem('ptExercises');
    const exercises = getPtExercises();
    console.log('Got exercises:', exercises.length);
    
    if (exercises.length === 0) {
        cardsRoot.innerHTML = '<p>Không có bài tập nào!</p>';
        return;
    }

    // Create cards directly
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
            <div style="background: #2196f3; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px; display: inline-block; margin-bottom: 10px;">
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
                        style="background: #4caf50; color: white; border: none; padding: 8px 15px; border-radius: 5px; margin-right: 5px; cursor: pointer;">
                    ➕ Mở Bài
                </button>
                <button onclick="viewImage('${ex.image}', '${ex.title}')" 
                        style="background: #ff5722; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
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
    
    console.log('=== Finished rendering Pt cards ===');
}

// Global function to view images
function viewImage(imageSrc, title) {
    window.open(imageSrc, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('➕ Pt page DOM loaded');
    
    if (typeof CommonJS !== 'undefined') {
        CommonJS.initializeCommon();
    }
    
    console.log('About to render pt cards');
    renderPtCards();
    console.log('✅ Pt cards rendering completed');
});