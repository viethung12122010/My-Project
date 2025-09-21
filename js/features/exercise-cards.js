// Exercise cards functionality - lazy loaded for Sohoc, Pt, Dethi pages
(function() {
    'use strict';

    const ExerciseCards = {
        // Render cards with lazy loading and intersection observer
        render(exercises, storageKey) {
            const cardsRoot = document.getElementById('cards');
            if (!cardsRoot) return;

            // Sort exercises
            const sortOrder = ['Mythical', 'Legendary', 'Rare', 'Uncommon', 'Common'];
            exercises.sort((a, b) => {
                const aIndex = sortOrder.indexOf(a.difficulty);
                const bIndex = sortOrder.indexOf(b.difficulty);
                return aIndex - bIndex;
            });

            // Create document fragment for better performance
            const fragment = document.createDocumentFragment();

            exercises.forEach((ex, index) => {
                const card = this.createCard(ex);
                
                // Lazy load images using Intersection Observer
                this.setupLazyLoading(card);
                
                // Add slight delay for animation
                card.style.animationDelay = `${index * 0.1}s`;
                card.classList.add('fade-in');
                
                fragment.appendChild(card);
            });

            cardsRoot.appendChild(fragment);
        },

        createCard(ex) {
            const card = document.createElement('article');
            card.className = `exercise-card ${ex.difficulty}`;
            card.innerHTML = `
                <div class="thumb">
                    <img data-src="${ex.image}" alt="${ex.title}" loading="lazy">
                </div>
                <div class="meta">
                    <div class="badge-diff ${ex.difficulty}">${ex.difficulty}</div>
                </div>
                <h3 class="title">${ex.title}</h3>
                <p class="desc">${ex.summary}</p>
                <div class="card-actions">
                    <button class="play-btn" data-action="open">Mở Đề</button>
                    <button class="btn-ghost" data-action="view"><i class="fa fa-eye"></i> Xem Ảnh</button>
                </div>
            `;

            // Event delegation for better performance
            card.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (action === 'open' || action === 'view' || e.target.closest('.exercise-card') === card) {
                    e.stopPropagation();
                    this.loadImageModal(() => {
                        window.ImageModal.show(ex.images || ex.image, ex.title, ex.summary);
                    });
                }
            });

            return card;
        },

        setupLazyLoading(card) {
            const img = card.querySelector('img[data-src]');
            if (!img) return;

            // Use Intersection Observer for lazy loading
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: '50px'
                });

                observer.observe(img);
            } else {
                // Fallback for older browsers
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        },

        async loadImageModal(callback) {
            if (window.ImageModal) {
                callback();
            } else {
                // Dynamically load image modal
                const script = document.createElement('script');
                script.src = '../js/features/image-modal.js';
                script.onload = callback;
                document.head.appendChild(script);
            }
        },

        // Add fade-in animation CSS if not present
        addAnimationCSS() {
            if (document.querySelector('#exercise-animations')) return;

            const style = document.createElement('style');
            style.id = 'exercise-animations';
            style.textContent = `
                .fade-in {
                    opacity: 0;
                    transform: translateY(20px);
                    animation: fadeInUp 0.6s ease forwards;
                }
                
                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    };

    // Export
    window.ExerciseCards = ExerciseCards;
})();