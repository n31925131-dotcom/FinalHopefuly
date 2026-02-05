// Rose Flower Shop - Dynamic Gallery Loader
// Loads gallery images from Dropbox via serverless API

// Determine API base - use relative path for Netlify functions
const API_BASE = window.location.origin;
const API_ENDPOINT = '/.netlify/functions/gallery';

let currentGalleryFilter = 'all';
let galleryData = null;

async function loadGalleryFromDropbox() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    try {
        grid.innerHTML = '<div class="col-span-full text-center py-20"><div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-600 border-t-transparent"></div><p class="mt-4 text-gray-600">Φόρτωση...</p></div>';

        // Fetch from Netlify function
        const response = await fetch(API_ENDPOINT);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        galleryData = data.categories;

        renderGallery();
    } catch (error) {
        console.error('Gallery loading error:', error);
        grid.innerHTML = `<div class="col-span-full text-center py-20 text-red-600">
            <p class="text-lg font-medium">Σφάλμα φόρτωσης gallery</p>
            <p class="text-sm mt-2">${error.message}</p>
        </div>`;
    }
}

function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid || !galleryData) return;

    grid.innerHTML = '';
    const currentLang = localStorage.getItem('language') || 'el';
    let hasImages = false;

    const categoriesToShow = currentGalleryFilter === 'all' 
        ? Object.keys(galleryData) 
        : [currentGalleryFilter];

    categoriesToShow.forEach(categoryName => {
        const images = galleryData[categoryName] || [];
        
        images.forEach(image => {
            hasImages = true;
            const item = document.createElement('div');
            item.className = 'gallery-item group cursor-pointer';
            item.dataset.category = categoryName.toLowerCase();

            const caption = image.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

            item.innerHTML = `
                <div class="relative h-80 rounded-xl overflow-hidden shadow-md">
                    <img src="${image.url}"
                         alt="${caption}"
                         class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                         loading="lazy">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <h3 class="text-white font-medium">${caption}</h3>
                    </div>
                </div>
            `;

            item.addEventListener('click', () => {
                showLightbox(image.url, caption);
            });

            grid.appendChild(item);
        });
    });

    if (!hasImages) {
        grid.innerHTML = '<div class="col-span-full text-center py-20 text-gray-600">Δεν υπάρχουν φωτογραφίες</div>';
    }
}

function filterGalleryImages(category) {
    currentGalleryFilter = category;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === category) {
            btn.classList.add('bg-rose-600', 'text-white');
            btn.classList.remove('bg-gray-100', 'text-gray-700');
        } else {
            btn.classList.remove('bg-rose-600', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-700');
        }
    });

    renderGallery();
}

function showLightbox(url, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');

    if (!lightbox || !lightboxImg) return;

    lightboxImg.src = url;
    if (lightboxTitle) lightboxTitle.textContent = caption;
    if (lightboxDesc) lightboxDesc.textContent = '';

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('gallery-grid')) {
        loadGalleryFromDropbox();

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                filterGalleryImages(btn.dataset.filter);
            });
        });

        window.addEventListener('languageChanged', () => {
            renderGallery();
        });
    }
});
