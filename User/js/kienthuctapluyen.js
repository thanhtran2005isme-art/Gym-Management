// Back to top
document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Category filter
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Update active state
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const category = this.dataset.category;
        const articles = document.querySelectorAll('.article-card');

        articles.forEach(article => {
            if (category === 'all' || article.dataset.category === category) {
                article.style.display = 'block';
                article.style.animation = 'fadeIn 0.5s ease';
            } else {
                article.style.display = 'none';
            }
        });
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

document.querySelectorAll('.article-card, .video-card').forEach(el => {
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

// Newsletter form
document.querySelector('.newsletter-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input').value;
    if (email) {
        alert('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi bài viết mới đến ' + email);
        this.querySelector('input').value = '';
    }
});

// Load more articles (simulation)
document.querySelector('.btn-load-more')?.addEventListener('click', function() {
    this.textContent = 'Đang tải...';
    setTimeout(() => {
        this.textContent = 'Đã tải hết bài viết';
        this.disabled = true;
        this.style.opacity = '0.5';
    }, 1500);
});
