// Sohoc page JavaScript functionality

const SOHOC_STORAGE_KEY = 'sohocExercises';

function getSohocExercises() {
    const storedExercises = localStorage.getItem(SOHOC_STORAGE_KEY);
    if (storedExercises) {
        return JSON.parse(storedExercises);
    }

    let exercises = [
        {
            id: 'sohoc-dongdu-1',
            title: 'Đồng Dư [1]',
            summary: 'Phương pháp đồng dư trong Số Học',
            image: '../asset/image/Sohoc/Dongdu/Dongdu1.jpg',
        },
        {
            id: 'sohoc-dongdu-2',
            title: 'Đồng Dư [2]',
            summary: 'Phương pháp đồng dư trong Số Học',
            image: '../asset/image/Sohoc/Dongdu/Dongdu2.jpg',
        },
        {
            id: 'sohoc-dongdu-3',
            title: 'Đồng Dư [3]',
            summary: 'Phương pháp đồng dư trong Số Học',
            image: '../asset/image/Sohoc/Dongdu/Dongdu3.jpg',
        },
        {
            id: 'sohoc-dongdu-4',
            title: 'Đồng Dư [4]',
            summary: 'Phương pháp đồng dư trong Số Học',
            image: '../asset/image/Sohoc/Dongdu/Dongdu4.jpg',
        },
        {
            id: 'sohoc-dongdu-5',
            title: 'Đồng Dư [5]',
            summary: 'Phương pháp đồng dư trong Số Học',
            image: '../asset/image/Sohoc/Dongdu/Dongdu5.jpg',
        },
        {
            id: 'sohoc-dongdu-6',
            title: 'Đồng Dư [6]',
            summary: 'Phương pháp đồng dư trong Số Học',
            image: '../asset/image/Sohoc/Dongdu/Dongdu6.jpg',
        },
        {
            id: 'sohoc-dongdu-7',
            title: 'Đồng Dư [7]',
            summary: 'Phương pháp đồng dư trong Số Học',
            image: '../asset/image/Sohoc/Dongdu/Dongdu7_1.jpg',
        },
        {
            id: 'sohoc-dongdu-8',
            title: 'Đồng Dư [8]',
            summary: 'Phương pháp đồng dư trong Số Học',
            image: '../asset/image/Sohoc/Dongdu/Dongdu7_2.jpg',
        },
        {
            id: 'sohoc-gcd-1',
            title: 'GCD [1]',
            summary: 'Bài toán về ước chung lớn nhất',
            image: '../asset/image/Sohoc/GCD/GCD_1.jpg',
        },
        {
            id: 'sohoc-gcd-2',
            title: 'GCD [2]',
            summary: 'Bài toán về ước chung lớn nhất',
            image: '../asset/image/Sohoc/GCD/GCD_2.jpg',
        },
        {
            id: 'sohoc-gcd-3',
            title: 'GCD [3]',
            summary: 'Bài toán về ước chung lớn nhất',
            image: '../asset/image/Sohoc/GCD/GCD_3.jpg',
        },
        {
            id: 'sohoc-luivohan-1',
            title: 'Lùi Vô Hạn',
            summary: 'Phương pháp lùi vô hạn',
            image: '../asset/image/Sohoc/Luivohan/Luivohan.jpg',
        },
        {
            id: 'sohoc-phannguyen-1',
            title: 'Phần Nguyên [1]',
            summary: 'Các bài toán về phần nguyên',
            image: '../asset/image/Sohoc/Phannguyen/Phannguyen_1.jpg',
        },
        {
            id: 'sohoc-phannguyen-2',
            title: 'Phần Nguyên [2]',
            summary: 'Các bài toán về phần nguyên',
            image: '../asset/image/Sohoc/Phannguyen/Phannguyen_2.jpg',
        },
        {
            id: 'sohoc-ptnn-1',
            title: 'PTNN (Lim) [1]',
            summary: 'Phương trình nghiệm nguyên',
            image: '../asset/image/Sohoc/PTNN/PTNN (Lim) [1].jpg',
        },
        {
            id: 'sohoc-ptnn-2',
            title: 'PT Nghiệm Nguyên',
            summary: 'Phương trình nghiệm nguyên',
            image: '../asset/image/Sohoc/PTNN/PTNN.jpg',
        }
    ];

    const rarities = ['Mythical', 'Legendary', 'Rare', 'Uncommon', 'Common'];
    exercises.forEach(ex => {
        if (ex.title.includes('(Lim)')) {
            ex.difficulty = 'Mythical';
        } else {
            ex.difficulty = rarities[Math.floor(Math.random() * rarities.length)];
        }
    });

    localStorage.setItem(SOHOC_STORAGE_KEY, JSON.stringify(exercises));
    return exercises;
}

function renderSohocCards() {
    console.log('=== Starting renderSohocCards ===');
    
    const cardsRoot = document.getElementById('cards');
    console.log('Cards container:', cardsRoot);
    
    if (!cardsRoot) {
        console.error('Cards container not found!');
        return;
    }

    // Clear existing content
    cardsRoot.innerHTML = '';
    
    // Force fresh data
    localStorage.removeItem('sohocExercises');
    const exercises = getSohocExercises();
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
            <div style="background: #9c27b0; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px; display: inline-block; margin-bottom: 10px;">
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
                        style="background: #ff9800; color: white; border: none; padding: 8px 15px; border-radius: 5px; margin-right: 5px; cursor: pointer;">
                    🧮 Mở Bài
                </button>
                <button onclick="viewImage('${ex.image}', '${ex.title}')" 
                        style="background: #e91e63; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
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
    
    console.log('=== Finished rendering Sohoc cards ===');
}

// Global function to view images
window.viewImage = function(imageSrc, title) {
    window.open(imageSrc, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('🧮 Sohoc page DOM loaded');
    
    if (typeof CommonJS !== 'undefined') {
        CommonJS.initializeCommon();
    }
    
    console.log('About to render sohoc cards');
    renderSohocCards();
    console.log('✅ Sohoc cards rendering completed');
});