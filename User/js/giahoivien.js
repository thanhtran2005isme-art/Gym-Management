// FAQ Toggle
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Back to top
document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Scroll Animation
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

// Observe elements
document.querySelectorAll('.plan-card, .faq-item, .comparison-table').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Add animate-in class styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Plan option selection effect
document.querySelectorAll('.plan-option').forEach(option => {
    option.addEventListener('click', function() {
        const parent = this.closest('.plan-card');
        parent.querySelectorAll('.plan-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        this.classList.add('selected');
    });
});

// Add selected style
const selectedStyle = document.createElement('style');
selectedStyle.textContent = `
    .plan-option.selected {
        border-color: #e60000 !important;
        background: linear-gradient(135deg, rgba(230, 0, 0, 0.1), rgba(230, 0, 0, 0.05)) !important;
    }
    .plan-card.featured .plan-option.selected {
        border-color: #6BB6FF !important;
        background: rgba(107, 182, 255, 0.3) !important;
    }
`;
document.head.appendChild(selectedStyle);

// Counter animation for prices
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString('vi-VN') + ' ₫';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
