document.addEventListener('DOMContentLoaded', () => {

    // ==================== MOBILE MENU TOGGLE ====================
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
        });
    });

    // ==================== FOOTER YEAR ====================
    document.getElementById('year').textContent = new Date().getFullYear();

    // ==================== SCROLL ANIMATIONS ====================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // ==================== PRODUCTS DATA ====================
    const imagesList = [
        'beverages.jpg', 'beverages2.jpg', 'beverages3.jpg', 'breakfast.jpg', 
        'deli.jpg', 'fruits.jpg', 'health.jpg', 'snacks.jpg', 'spices.jpg', 
        'stand10.jpg', 'stand13.jpg', 'stand14.jpg', 'stand15.jpg', 'stand16.jpg', 
        'stand17.jpg', 'stand18.jpg', 'stand20.jpg', 'stand22.jpg', 'stand23.jpg', 
        'stand26.jpg', 'stand28.jpg', 'stand3.jpg', 'stand6.jpg', 'stand7.jpg', 
        'stand9.jpg', 'tortillas.jpg', 'vegetables.jpg', 'vegetables2.jpg'
    ];

    const track = document.getElementById('carouselTrack');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');
    const closeModal = document.querySelector('.close-modal');
    const modalPrev = document.getElementById('modalPrevBtn');
    const modalNext = document.getElementById('modalNextBtn');

    let currentModalIndex = 0;
    let autoPlayInterval;
    let currentCarouselIndex = 0;

    function formatImageName(filename) {
        return filename.replace('.jpg', '')
                      .replace(/(\d+)/g, ' $1')
                      .replace(/^./, str => str.toUpperCase());
    }


    function isStandImage(filename) {
        return filename.toLowerCase().includes('stand');
    }


    imagesList.forEach(img => {
        const item = document.createElement('div');
        item.classList.add('carousel-item');
        
        const imgElement = document.createElement('img');
        imgElement.src = `assets/img/${img}`;
        imgElement.alt = formatImageName(img);
        imgElement.loading = "lazy";
        

        imgElement.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = imagesList.findIndex(i => i === img);
            openModalWithImage(index);
        });

        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add('carousel-img-wrapper');
        imgWrapper.appendChild(imgElement);
        item.appendChild(imgWrapper);

        if (!isStandImage(img)) {
            const titleElement = document.createElement('h3');
            titleElement.textContent = formatImageName(img);
            item.appendChild(titleElement);
        }
        
        track.appendChild(item);
    });

    // ==================== CAROUSEL NAVIGATION ====================
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    function getItemsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;
    }

    function updateCarousel() {
        const item = track.querySelector('.carousel-item');
        if (!item) return;
        const itemWidth = item.offsetWidth;
        const gap = 25;
        track.style.transform = `translateX(-${currentCarouselIndex * (itemWidth + gap)}px)`;
    }

    function moveNextCarousel() {
        const maxIndex = imagesList.length - getItemsPerView();
        if (currentCarouselIndex < maxIndex) {
            currentCarouselIndex++;
        } else {
            currentCarouselIndex = 0;
        }
        updateCarousel();
    }

    function movePrevCarousel() {
        const maxIndex = imagesList.length - getItemsPerView();
        if (currentCarouselIndex > 0) {
            currentCarouselIndex--;
        } else {
            currentCarouselIndex = maxIndex;
        }
        updateCarousel();
    }

    nextBtn.addEventListener('click', moveNextCarousel);
    prevBtn.addEventListener('click', movePrevCarousel);
    window.addEventListener('resize', updateCarousel);

    // Autoplay
    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(moveNextCarousel, 4000);
    }
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    startAutoPlay();

    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);

    // ==================== MODAL WITH NAVIGATION ====================
    function openModalWithImage(index) {
        if (index < 0) index = 0;
        if (index >= imagesList.length) index = imagesList.length - 1;
        currentModalIndex = index;
        const imgFile = imagesList[currentModalIndex];
        modalImg.src = `assets/img/${imgFile}`;
        if (!isStandImage(imgFile)) {
            captionText.textContent = formatImageName(imgFile);
            captionText.style.display = "block";
        } else {
            captionText.style.display = "none";
        }
        modal.style.display = "block";
        stopAutoPlay();  // pausa carrusel mientras modal abierto
    }

    function showNextModalImage() {
        let newIndex = currentModalIndex + 1;
        if (newIndex >= imagesList.length) newIndex = 0;
        openModalWithImage(newIndex);
    }

    function showPrevModalImage() {
        let newIndex = currentModalIndex - 1;
        if (newIndex < 0) newIndex = imagesList.length - 1;
        openModalWithImage(newIndex);
    }

    modalNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextModalImage();
    });
    modalPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevModalImage();
    });
    

    modalImg.addEventListener('click', () => {
        showNextModalImage();
    });

    // Cerrar modal
    closeModal.addEventListener('click', () => {
        modal.style.display = "none";
        startAutoPlay();   
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            startAutoPlay();
        }
    });


    let startX;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoPlay();
    }, {passive: true});

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        let endX = e.changedTouches[0].clientX;
        let diffX = startX - endX;

        if (diffX > 50) moveNextCarousel();
        else if (diffX < -50) movePrevCarousel();
        
        isDragging = false;
        startAutoPlay();
    });
});