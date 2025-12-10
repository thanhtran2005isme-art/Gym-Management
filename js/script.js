// ====================================
// MOBILE MENU TOGGLE
// ====================================
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = mobileToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(8px, -8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });
}

// ====================================
// HERO SLIDER
// ====================================
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const slideCount = slides.length;
const sliderDots = document.getElementById('sliderDots');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');

// Create dots
if (sliderDots && slideCount > 0) {
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        sliderDots.appendChild(dot);
    }
}

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });

    // Update dots
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === index) {
            dot.classList.add('active');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slideCount;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    showSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
}

// Auto-advance slider every 5 seconds
let sliderInterval;
if (slideCount > 1) {
    sliderInterval = setInterval(nextSlide, 5000);
}

// Pause auto-advance on hover
const heroSlider = document.querySelector('.hero-slider');
if (heroSlider) {
    heroSlider.addEventListener('mouseenter', () => {
        clearInterval(sliderInterval);
    });

    heroSlider.addEventListener('mouseleave', () => {
        if (slideCount > 1) {
            sliderInterval = setInterval(nextSlide, 5000);
        }
    });
}

// Slider navigation buttons
if (sliderNext) {
    sliderNext.addEventListener('click', () => {
        nextSlide();
        clearInterval(sliderInterval);
        sliderInterval = setInterval(nextSlide, 5000);
    });
}

if (sliderPrev) {
    sliderPrev.addEventListener('click', () => {
        prevSlide();
        clearInterval(sliderInterval);
        sliderInterval = setInterval(nextSlide, 5000);
    });
}

// ====================================
// BACK TO TOP BUTTON
// ====================================
const backToTop = document.getElementById('backToTop');

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/Hide based on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
        } else {
            backToTop.style.opacity = '0.6';
        }
    });
}

// ====================================
// SMOOTH SCROLL FOR NAVIGATION LINKS
// ====================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Don't prevent default for # or #join (external links)
        if (href === '#' || href === '#join') {
            return;
        }

        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ====================================
// STICKY NAVBAR HIDE/SHOW ON SCROLL
// ====================================
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
const navbarHeight = navbar ? navbar.offsetHeight : 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (navbar) {
        if (scrollTop > lastScrollTop && scrollTop > 150) {
            // Scrolling down
            navbar.style.transform = `translateY(-${navbarHeight}px)`;
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ====================================
// ACTIVE NAV LINK ON SCROLL
// ====================================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 250) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ====================================
// ANIMATE ELEMENTS ON SCROLL
// ====================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-block, .pricing-card, .map-section, .location-section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// ====================================
// CITY SELECTOR
// ====================================
const citySelect = document.querySelector('.city-select');
if (citySelect) {
    citySelect.addEventListener('change', (e) => {
        const selectedCity = e.target.value;
        if (selectedCity) {
            console.log('Selected city:', selectedCity);
            // Add logic to filter gyms or redirect to specific page
            // Example: window.location.href = `/locations/${selectedCity}`;
        }
    });
}

// ====================================
// PRICING CARD HOVER EFFECTS
// ====================================
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        if (!card.classList.contains('featured')) {
            card.style.borderColor = 'var(--primary-red)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('featured')) {
            card.style.borderColor = '#e0e0e0';
        }
    });
});

// ====================================
// FLOATING BUTTONS ANIMATION
// ====================================
const floatingButtons = document.querySelectorAll('.float-btn');
floatingButtons.forEach((btn, index) => {
    btn.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
    btn.style.opacity = '0';
});

// Add fadeInUp animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ====================================
// FORM VALIDATION (if needed later)
// ====================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9]{10,11}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// ====================================
// KEYBOARD NAVIGATION FOR SLIDER
// ====================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        clearInterval(sliderInterval);
        sliderInterval = setInterval(nextSlide, 5000);
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        clearInterval(sliderInterval);
        sliderInterval = setInterval(nextSlide, 5000);
    }
});

// ====================================
// LAZY LOADING IMAGES
// ====================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ====================================
// CONSOLE WELCOME MESSAGE
// ====================================
console.log(
    '%c🏋️ Welcome to The New Gym! 🏋️',
    'color: #e60000; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);'
);
console.log(
    '%cGym cho mọi người - Không gian không phán xét',
    'color: #333; font-size: 16px; font-weight: normal;'
);

// ====================================
// PERFORMANCE MONITORING
// ====================================
window.addEventListener('load', () => {
    // Log page load time
    const loadTime = window.performance.timing.domContentLoadedEventEnd - 
                     window.performance.timing.navigationStart;
    console.log(`⚡ Page loaded in ${loadTime}ms`);
});

// ====================================
// INITIALIZE ON DOM READY
// ====================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ The New Gym website initialized successfully!');
    
    // Show first slide
    if (slides.length > 0) {
        showSlide(0);
    }
    
    // Add loaded class to body for animations
    document.body.classList.add('loaded');
});

// ====================================
// HANDLE ONLINE/OFFLINE STATUS
// ====================================
window.addEventListener('online', () => {
    console.log('✅ Connection restored');
});

window.addEventListener('offline', () => {
    console.log('⚠️ No internet connection');
});

// ====================================
// PREVENT ZOOM ON DOUBLE TAP (MOBILE)
// ====================================
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ====================================
// ADD RIPPLE EFFECT TO BUTTONS
// ====================================
document.querySelectorAll('button, .btn-primary, .btn-outline').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple effect styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    button, .btn-primary, .btn-outline {
        position: relative;
        overflow: hidden;
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);