// Pt page (Pt.html) JavaScript functionality

const PT_STORAGE_KEY = 'ptExercises';

function getPtExercises() {
    const storedExercises = localStorage.getItem(PT_STORAGE_KEY);
    if (storedExercises) {
        return JSON.parse(storedExercises);
    }

    let exercises = [
        // PT (Phương Trình)
        {
            id: 'pt-1',
            title: 'Phương trình - Dạng 1.1',
            summary: 'Các bài toán cơ bản về phương trình.',
            image: '../asset/image/PT-HPT/PT/PT1_1.jpg',
        },
        {
            id: 'pt-2',
            title: 'Phương trình - Dạng 1.2',
            summary: 'Các bài toán cơ bản về phương trình',
            image: '../asset/image/PT-HPT/PT/PT1_2.jpg',
        },
        {
            id: 'pt-3',
            title: 'Phương trình - Dạng 2',
            summary: 'Các bài toán nâng cao về phương trình.',
            image: '../asset/image/PT-HPT/PT/PT2.jpg',
        },
        // HPT (Hệ Phương Trình)
        {
            id: 'hpt-1',
            title: 'Hệ Phương trình - Dạng 1',
            summary: 'Các bài toán cơ bản về hệ phương trình.',
            image: '../asset/image/PT-HPT/HPT/HPT1.jpg',
        },
        {
            id: 'hpt-2',
            title: 'Hệ Phương trình - Dạng 2',
            summary: 'Các bài toán nâng cao về hệ phương trình.',
            image: '../asset/image/PT-HPT/HPT/HPT2.jpg',
        },
        {
            id: 'hpt-3',
            title: 'Hệ Phương trình - Dạng 3',
            summary: 'Các bài toán phức tạp và các trường hợp đặc biệt.',
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
    const exercises = getPtExercises();
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    CommonJS.initializeCommon();
    renderPtCards();
});