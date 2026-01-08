// Back to top
document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// City filter
document.getElementById('cityFilter')?.addEventListener('change', function() {
    const selectedCity = this.value;
    const cityGroups = document.querySelectorAll('.city-group');
    
    cityGroups.forEach(group => {
        if (!selectedCity || group.id === selectedCity) {
            group.style.display = 'block';
            group.style.animation = 'fadeIn 0.5s ease';
        } else {
            group.style.display = 'none';
        }
    });
});

// Search functionality
document.getElementById('searchInput')?.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const locationCards = document.querySelectorAll('.location-card');
    
    locationCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const address = card.querySelector('.location-address').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || address.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
});

// Scroll animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.location-card, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Smooth scroll to city sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});
