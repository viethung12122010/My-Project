// Image modal feature - lazy loaded for pages with image viewing
(function() {
    'use strict';

    const ImageModal = {
        show(imgSrc, title, desc) {
            const container = document.getElementById('viewImageModalImagesContainer');
            if (!container) return;
            
            container.innerHTML = '';
            const images = Array.isArray(imgSrc) ? imgSrc : [imgSrc];
            
            images.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = title;
                img.style.width = "100%";
                img.style.marginBottom = "10px";
                img.loading = "lazy"; // Lazy load images
                container.appendChild(img);
            });

            const titleElement = document.getElementById('viewImageModalTitle');
            const descElement = document.getElementById('viewImageModalDesc');
            
            if (titleElement) titleElement.innerText = title;
            if (descElement) descElement.innerText = desc;
            
            // Load Bootstrap modal only when needed
            this.loadBootstrapModal();
        },

        async loadBootstrapModal() {
            if (window.bootstrap?.Modal) {
                const modal = new bootstrap.Modal(document.getElementById('viewImageModal'));
                modal.show();
            } else {
                // Bootstrap not loaded yet, wait a bit
                setTimeout(() => this.loadBootstrapModal(), 100);
            }
        }
    };

    // Export
    window.ImageModal = ImageModal;
})();