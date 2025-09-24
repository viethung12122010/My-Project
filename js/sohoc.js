// Sohoc page (Sohoc.html) JavaScript functionality

const SOHOC_STORAGE_KEY = 'sohocExercises';

function getSohocExercises() {
    const storedExercises = localStorage.getItem(SOHOC_STORAGE_KEY);
    if (storedExercises) {
        return JSON.parse(storedExercises);
    }

    let exercises = [
        // Dongdu
        {
            id: 'sohoc-dd-1',
            title: 'Đồng Dư [1]',
            summary: 'Phương pháp đồng dư trong Số Học',
            image: '../asset/image/Sohoc/Dongdu/Dongdu1.jpg',
        },
        {
            id: 'sohoc-dd-2',
            title: 'Đồng Dư [2]',
            summary: 'Phương pháp đồng dư trong Số Học',
            image: '../asset/image/Sohoc/Dongdu/Dongdu2.jpg',
        },
        {
            id: 'sohoc-dd-3',
            title: 'Đồng Dư [3]',
            summary: 'Phương pháp đồng dư trong Số Học',
            image: '../asset/image/Sohoc/Dongdu/Dongdu3.jpg',
        },
        {
            id: 'sohoc-dd-4',
            title: 'Đồng Dư [4]',
            summary: 'Phương pháp đồng dư trong Số Học',
            image: '../asset/image/Sohoc/Dongdu/Dongdu4.jpg',
        },
        {
            id: 'sohoc-dd-5',
            title: 'Đồng Dư [5]',
            summary: 'Phương pháp đồng dư trong Số Học',
            image: '../asset/image/Sohoc/Dongdu/Dongdu5.jpg',
        },
        {
            id: 'sohoc-dd-6',
            title: 'Đồng Dư [6]',
            summary: 'Phương pháp đồng dư trong Số Học',
            image: '../asset/image/Sohoc/Dongdu/Dongdu6.jpg',
        },
        {
            id: 'sohoc-dd-7',
            title: 'Đồng Dư [7.1]',
            summary: 'Phương pháp đồng dư trong Số Học',
            image: '../asset/image/Sohoc/Dongdu/Dongdu7_1.jpg',
        },
        {
            id: 'sohoc-dd-8',
            title: 'Đồng Dư [7.2]',
            summary: 'Phương pháp đồng dư trong Số Học',
            image: '../asset/image/Sohoc/Dongdu/Dongdu7_2.jpg',
        },
        // GCD
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
        // Luivohan
        {
            id: 'sohoc-luivohan-1',
            title: 'Lùi Vô Hạn',
            summary: 'Phương pháp lùi vô hạn',
            image: '../asset/image/Sohoc/Luivohan/Luivohan.jpg',
        },
        // Phannguyen
        {
            id: 'sohoc-pn-1',
            title: 'Phần Nguyên [1]',
            summary: 'Các bài toán về phần nguyên',
            image: '../asset/image/Sohoc/Phannguyen/Phannguyen_1.jpg',
        },
        {
            id: 'sohoc-pn-2',
            title: 'Phần Nguyên [2]',
            summary: 'Các bài toán về phần nguyên',
            image: '../asset/image/Sohoc/Phannguyen/Phannguyen_2.jpg',
        },
        // PTNN
        {
            id: 'sohoc-ptnn-1',
            title: 'PT Nghiệm Nguyên',
            summary: 'Phương trình nghiệm nguyên',
            image: '../asset/image/Sohoc/PTNN/PTNN.jpg',
        },
        {
            id: 'sohoc-ptnn-2',
            title: 'PTNN (Lim) [1]',
            summary: 'Phương trình nghiệm nguyên (Lim)',
            image: '../asset/image/Sohoc/PTNN/PTNN (Lim) [1].jpg',
        },
    ];

    const rarities = ['Legendary', 'Rare', 'Uncommon', 'Common'];
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
    const exercises = getSohocExercises();
    const sortOrder = ['Mythical', 'Legendary', 'Rare', 'Uncommon', 'Common'];
    exercises.sort((a, b) => {
        const aIndex = sortOrder.indexOf(a.difficulty);
        const bIndex = sortOrder.indexOf(b.difficulty);
        return aIndex - bIndex;
    });

    const cardsRoot = document.getElementById('cards');
    if (!cardsRoot) return;

    exercises.forEach(ex => {
        const card = document.createElement('article');
        card.className = `exercise-card ${ex.difficulty}`;
        card.innerHTML = `
            <div class="thumb">
                <img src="${ex.image}" alt="${ex.title}">
            </div>
            <div class="meta">
                <div class="badge-diff ${ex.difficulty}">${ex.difficulty}</div>
            </div>
            <h3 class="title">${ex.title}</h3>
            <p class="desc">${ex.summary}</p>
            <div class="card-actions">
                <button class="play-btn">Mở Đề</button>
                <button class="btn-ghost"><i class="fa fa-eye"></i> Xem Ảnh</button>
            </div>
        `;

        card.querySelector('.play-btn').addEventListener('click', (ev) => {
            ev.stopPropagation();
            CommonJS.showImageInModal(ex.image, ex.title, ex.summary);
        });

        card.querySelector('.btn-ghost').addEventListener('click', (ev) => {
            ev.stopPropagation();
            CommonJS.showImageInModal(ex.image, ex.title, ex.summary);
        });

        card.addEventListener('click', () => CommonJS.showImageInModal(ex.image, ex.title, ex.summary));
        cardsRoot.appendChild(card);
    });
}

// Sohoc page - optimized
(function() {
    'use strict';

    function renderSohocCards() {
        const exercises = getSohocExercises();
        
        // Use optimized exercise cards renderer
        if (window.ExerciseCards) {
            window.ExerciseCards.addAnimationCSS();
            window.ExerciseCards.render(exercises, SOHOC_STORAGE_KEY);
        } else {
            // Fallback to basic rendering
            renderBasicCards(exercises);
        }
    }

    function renderBasicCards(exercises) {
        const cardsRoot = document.getElementById('cards');
        if (!cardsRoot) return;

        exercises.forEach(ex => {
            const card = document.createElement('article');
            card.className = `exercise-card ${ex.difficulty}`;
            card.innerHTML = `
                <div class="thumb">
                    <img src="${ex.image}" alt="${ex.title}" loading="lazy">
                </div>
                <div class="meta">
                    <div class="badge-diff ${ex.difficulty}">${ex.difficulty}</div>
                </div>
                <h3 class="title">${ex.title}</h3>
                <p class="desc">${ex.summary}</p>
                <div class="card-actions">
                    <button class="play-btn">Mở Đề</button>
                    <button class="btn-ghost"><i class="fa fa-eye"></i> Xem Ảnh</button>
                </div>
            `;
            cardsRoot.appendChild(card);
        });
    }

    // Auto-initialize when ready
    if (window.ExerciseCards) {
        renderSohocCards();
    } else {
        // Wait for ExerciseCards to load
        const checkReady = setInterval(() => {
            if (window.ExerciseCards) {
                clearInterval(checkReady);
                renderSohocCards();
            }
        }, 50);
    }
})();