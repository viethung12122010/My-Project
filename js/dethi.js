// Dethi page (Dethi.html) JavaScript functionality

const DETHI_STORAGE_KEY = 'dethiExercises';

function getDethiExercises() {
    const storedExercises = localStorage.getItem(DETHI_STORAGE_KEY);
    if (storedExercises) {
        return JSON.parse(storedExercises);
    }

    let exercises = [
        {
            id: 'dethi-khtn-2009-1',
            title: 'KHTN 2009-2010 V1',
            summary: 'Đề thi KHTN năm học 2009-2010 Vòng 1.',
            image: '../asset/image/Dethi/KHTN/KHTN_2009-2010_v1.jpg',
        },
        {
            id: 'dethi-khtn-2009-2',
            title: 'KHTN 2009-2010 V2',
            summary: 'Đề thi KHTN năm học 2009-2010 Vòng 2.',
            image: '../asset/image/Dethi/KHTN/KHTN_2009-2010_v2.jpg',
        },
        {
            id: 'dethi-khtn-2010-1',
            title: 'KHTN 2010-2011 V1',
            summary: 'Đề thi KHTN năm học 2010-2011 Vòng 1.',
            image: '../asset/image/Dethi/KHTN/KHTN_2010-2011_v1.jpg',
        },
        {
            id: 'dethi-khtn-2010-2',
            title: 'KHTN 2010-2011 V2',
            summary: 'Đề thi KHTN năm học 2010-2011 Vòng 2.',
            image: '../asset/image/Dethi/KHTN/KHTN_2010-2011_v2.jpg',
        },
        {
            id: 'dethi-khtn-2011-1',
            title: 'KHTN 2011-2012 V1',
            summary: 'Đề thi KHTN năm học 2011-2012 Vòng 1.',
            image: '../asset/image/Dethi/KHTN/KHTN_2011-2012_v1.jpg',
        },
        {
            id: 'dethi-khtn-2011-2',
            title: 'KHTN 2011-2012 V2',
            summary: 'Đề thi KHTN năm học 2011-2012 Vòng 2.',
            image: '../asset/image/Dethi/KHTN/KHTN_2011-2012_v2.jpg',
        },
        {
            id: 'dethi-khtn-2012-1',
            title: 'KHTN 2012-2013 V1',
            summary: 'Đề thi KHTN năm học 2012-2013 Vòng 1.',
            image: '../asset/image/Dethi/KHTN/KHTN_2012-2013_v1.jpg',
        },
        {
            id: 'dethi-khtn-2012-2',
            title: 'KHTN 2012-2013 V2',
            summary: 'Đề thi KHTN năm học 2012-2013 Vòng 2.',
            image: '../asset/image/Dethi/KHTN/KHTN_2012-2013_v2.jpg',
        },
        {
            id: 'dethi-khtn-2018-1',
            title: 'KHTN 2018-2019 V1',
            summary: 'Đề thi KHTN năm học 2018-2019 Vòng 1.',
            image: '../asset/image/Dethi/KHTN/KHTN_2018-2019_V1.jpg',
        },
        {
            id: 'dethi-khtn-2018-2',
            title: 'KHTN 2018-2019 V2',
            summary: 'Đề thi KHTN năm học 2018-2019 Vòng 2.',
            image: '../asset/image/Dethi/KHTN/KHTN_2018-2019_V2.jpg',
        },
        {
            id: 'dethi-khtn-2019-1',
            title: 'KHTN 2019-2020 V1',
            summary: 'Đề thi KHTN năm học 2019-2020 Vòng 1.',
            image: '../asset/image/Dethi/KHTN/KHTN_2019-2020_v1.jpg',
        },
        {
            id: 'dethi-khtn-2019-2',
            title: 'KHTN 2019-2020 V2',
            summary: 'Đề thi KHTN năm học 2019-2020 Vòng 2.',
            image: '../asset/image/Dethi/KHTN/KHTN_2019-2020_v2.jpg',
        },
        {
            id: 'dethi-lim-2',
            title: 'Khảo sát Lim Đợt 2',
            summary: 'Đề thi khảo sát tại CLB Lim đợt 2',
            image: '../asset/image/Dethi/Lim/Lim_dot_2.jpg',
            images: ['../asset/image/Dethi/Lim/Lim_dot_2.jpg', '../asset/image/Dethi/Lim/Lim_dot_2_2.jpg'],
        },
        {
            id: 'dethi-lim-3',
            title: 'Khảo sát Lim Đợt 3',
            summary: 'Đề thi khảo sát tại CLB Lim đợt 3',
            image: '../asset/image/Dethi/Lim/Lim_dot_3.jpg',
            images: ['../asset/image/Dethi/Lim/Lim_dot_3.jpg', '../asset/image/Dethi/Lim/Lim_dot_3_2.jpg'],
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
    const exercises = getDethiExercises();
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
            CommonJS.showImageInModal(ex.images || ex.image, ex.title, ex.summary);
        });

        card.querySelector('.btn-ghost').addEventListener('click', (ev) => {
            ev.stopPropagation();
            CommonJS.showImageInModal(ex.images || ex.image, ex.title, ex.summary);
        });

        card.addEventListener('click', () => CommonJS.showImageInModal(ex.images || ex.image, ex.title, ex.summary));
        cardsRoot.appendChild(card);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    CommonJS.initializeCommon();
    renderDethiCards();
});