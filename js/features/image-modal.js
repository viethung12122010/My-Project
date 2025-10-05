// Enhanced Image Modal with Zoom Functionality
(function() {
    'use strict';

    const ImageModal = {
        modal: null,
        modalImg: null,
        currentZoom: 1,
        isDragging: false,
        startX: 0,
        startY: 0,
        initialX: 0,
        initialY: 0,

        init() {
            if (this.modal) return; // Already initialized

            // Create modal HTML
            const modalHTML = `
                <div id="imageZoomModal" class="image-zoom-modal">
                    <div class="modal-background"></div>
                    <div class="modal-container">
                        <span class="close-modal">&times;</span>
                        <img class="modal-image" id="modalZoomImage">
                        <div class="modal-caption" id="modalZoomCaption"></div>
                        <div class="modal-controls">
                            <button class="modal-btn zoom-in" title="Zoom In (+)">
                                <i class="fas fa-search-plus"></i>
                            </button>
                            <button class="modal-btn zoom-out" title="Zoom Out (-)">
                                <i class="fas fa-search-minus"></i>
                            </button>
                            <button class="modal-btn reset-zoom" title="Reset Zoom (0)">
                                <i class="fas fa-expand-arrows-alt"></i>
                            </button>
                            <button class="modal-btn download" title="Download">
                                <i class="fas fa-download"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            this.modal = document.getElementById('imageZoomModal');
            this.modalImg = document.getElementById('modalZoomImage');
            this.modalCaption = document.getElementById('modalZoomCaption');
            
            this.addEventListeners();
            this.addStyles();
        },

        addStyles() {
            if (document.getElementById('imageModalStyles')) return;

            const styles = `
                <style id="imageModalStyles">
                .image-zoom-modal {
                    display: none;
                    position: fixed;
                    z-index: 10000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .image-zoom-modal.show {
                    opacity: 1;
                }

                .modal-background {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle, rgba(20,20,40,0.8) 0%, rgba(0,0,0,0.95) 100%);
                }

                .modal-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                }

                .close-modal {
                    position: absolute;
                    top: 20px;
                    right: 35px;
                    color: #fff;
                    font-size: 40px;
                    font-weight: bold;
                    cursor: pointer;
                    z-index: 10001;
                    transition: all 0.3s ease;
                    text-shadow: 0 0 10px rgba(255,255,255,0.5);
                }

                .close-modal:hover {
                    color: #ff6b6b;
                    transform: scale(1.2) rotate(90deg);
                    text-shadow: 0 0 20px rgba(255,107,107,0.8);
                }

                .modal-image {
                    max-width: 90vw;
                    max-height: 85vh;
                    border-radius: 15px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 50px rgba(37,117,252,0.3);
                    transition: transform 0.3s ease;
                    cursor: grab;
                    border: 2px solid rgba(255,255,255,0.1);
                }

                .modal-image:active {
                    cursor: grabbing;
                }

                .modal-caption {
                    color: #fff;
                    text-align: center;
                    margin-top: 20px;
                    font-size: 18px;
                    font-weight: 600;
                    text-shadow: 0 2px 10px rgba(0,0,0,0.8);
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    padding: 10px;
                }

                .modal-controls {
                    position: absolute;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 15px;
                    background: rgba(20,20,40,0.9);
                    padding: 15px 25px;
                    border-radius: 50px;
                    border: 2px solid rgba(255,255,255,0.1);
                    backdrop-filter: blur(20px);
                }

                .modal-btn {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border: none;
                    color: white;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    transition: all 0.3s ease;
                    box-shadow: 0 5px 15px rgba(102,126,234,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modal-btn:hover {
                    transform: translateY(-3px) scale(1.1);
                    box-shadow: 0 10px 25px rgba(102,126,234,0.5);
                    background: linear-gradient(135deg, #764ba2, #667eea);
                }

                .modal-btn.zoom-in:hover {
                    background: linear-gradient(135deg, #4CAF50, #45a049);
                    box-shadow: 0 10px 25px rgba(76,175,80,0.5);
                }

                .modal-btn.zoom-out:hover {
                    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                    box-shadow: 0 10px 25px rgba(255,107,107,0.5);
                }

                .modal-btn.download:hover {
                    background: linear-gradient(135deg, #f39c12, #e67e22);
                    box-shadow: 0 10px 25px rgba(243,156,18,0.5);
                }

                @media (max-width: 768px) {
                    .modal-controls {
                        bottom: 15px;
                        gap: 10px;
                        padding: 10px 15px;
                    }

                    .modal-btn {
                        width: 40px;
                        height: 40px;
                        font-size: 14px;
                    }

                    .close-modal {
                        top: 10px;
                        right: 15px;
                        font-size: 30px;
                    }
                }
                </style>
            `;

            document.head.insertAdjacentHTML('beforeend', styles);
        },

        addEventListeners() {
            // Close modal events
            this.modal.querySelector('.close-modal').addEventListener('click', () => this.close());
            this.modal.querySelector('.modal-background').addEventListener('click', () => this.close());

            // Zoom controls
            this.modal.querySelector('.zoom-in').addEventListener('click', () => this.zoomIn());
            this.modal.querySelector('.zoom-out').addEventListener('click', () => this.zoomOut());
            this.modal.querySelector('.reset-zoom').addEventListener('click', () => this.resetZoom());
            this.modal.querySelector('.download').addEventListener('click', () => this.downloadImage());

            // Keyboard controls
            document.addEventListener('keydown', (e) => {
                if (this.modal.style.display === 'block') {
                    switch(e.key) {
                        case 'Escape':
                            this.close();
                            break;
                        case '+':
                        case '=':
                            this.zoomIn();
                            break;
                        case '-':
                            this.zoomOut();
                            break;
                        case '0':
                            this.resetZoom();
                            break;
                    }
                }
            });

            // Mouse wheel zoom
            this.modalImg.addEventListener('wheel', (e) => {
                e.preventDefault();
                if (e.deltaY < 0) {
                    this.zoomIn();
                } else {
                    this.zoomOut();
                }
            });

            // Drag functionality
            this.addDragFunctionality();
        },

        addDragFunctionality() {
            this.modalImg.addEventListener('mousedown', (e) => {
                if (this.currentZoom > 1) {
                    this.isDragging = true;
                    this.startX = e.clientX;
                    this.startY = e.clientY;
                    
                    const transform = this.modalImg.style.transform;
                    const translateMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                    
                    if (translateMatch) {
                        this.initialX = parseFloat(translateMatch[1]);
                        this.initialY = parseFloat(translateMatch[2]);
                    } else {
                        this.initialX = 0;
                        this.initialY = 0;
                    }
                    
                    e.preventDefault();
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (this.isDragging) {
                    const deltaX = e.clientX - this.startX;
                    const deltaY = e.clientY - this.startY;
                    
                    const newX = this.initialX + deltaX;
                    const newY = this.initialY + deltaY;
                    
                    this.modalImg.style.transform = `scale(${this.currentZoom}) translate(${newX}px, ${newY}px)`;
                }
            });

            document.addEventListener('mouseup', () => {
                this.isDragging = false;
            });
        },

        show(imgSrc, title = '', desc = '') {
            this.init();
            
            this.modal.style.display = 'block';
            this.modalImg.src = imgSrc;
            this.modalCaption.textContent = title || desc;
            this.resetZoom();
            
            // Add animation
            setTimeout(() => {
                this.modal.classList.add('show');
            }, 10);
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        },

        close() {
            this.modal.classList.remove('show');
            setTimeout(() => {
                this.modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        },

        zoomIn() {
            this.currentZoom = Math.min(this.currentZoom * 1.2, 5);
            this.updateZoom();
        },

        zoomOut() {
            this.currentZoom = Math.max(this.currentZoom / 1.2, 0.5);
            this.updateZoom();
        },

        resetZoom() {
            this.currentZoom = 1;
            this.modalImg.style.transform = 'scale(1) translate(0px, 0px)';
        },

        updateZoom() {
            this.modalImg.style.transform = `scale(${this.currentZoom}) translate(0px, 0px)`;
        },

        downloadImage() {
            const link = document.createElement('a');
            link.download = 'exercise-image.jpg';
            link.href = this.modalImg.src;
            link.click();
        }
    };

    // Export to global
    window.ImageModal = ImageModal;
})();

// Function to open image modal (to be called from HTML)
function openImageModal(imgElement) {
    const src = imgElement.src;
    const alt = imgElement.alt || '';
    window.ImageModal.show(src, alt);
}