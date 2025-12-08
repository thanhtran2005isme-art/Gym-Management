// ===== User Database (Demo) =====
const users = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        name: 'Nguyễn Admin',
        email: 'admin@fitzone.vn',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff'
    },
    {
        id: 2,
        username: 'trainer',
        password: 'trainer123',
        name: 'Trần Văn PT',
        email: 'trainer@fitzone.vn',
        role: 'trainer',
        avatar: 'https://ui-avatars.com/api/?name=Trainer&background=10b981&color=fff'
    },
    {
        id: 3,
        username: 'member',
        password: 'member123',
        name: 'Lê Thị Hội Viên',
        email: 'member@fitzone.vn',
        role: 'member',
        avatar: 'https://ui-avatars.com/api/?name=Member&background=3b82f6&color=fff'
    }
];

// ===== Role Permissions =====
const rolePermissions = {
    admin: {
        label: 'Quản trị viên',
        color: '#6366f1',
        permissions: ['all'],
        menuItems: ['dashboard', 'members', 'packages', 'trainers', 'schedule', 'checkin', 'facilities', 'invoices', 'reports', 'settings']
    },
    trainer: {
        label: 'Huấn luyện viên',
        color: '#10b981',
        permissions: ['view_schedule', 'manage_own_schedule', 'view_members', 'checkin_session'],
        menuItems: ['dashboard', 'schedule', 'members', 'checkin']
    },
    member: {
        label: 'Hội viên',
        color: '#3b82f6',
        permissions: ['view_own_profile', 'view_own_schedule', 'view_own_invoices'],
        menuItems: ['dashboard', 'schedule', 'invoices']
    }
};

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function() {
    initThemeLogin();
    checkRememberedUser();
});

// ===== Theme for Login Page =====
function initThemeLogin() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleThemeLogin() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('themeToggleLogin');
    if (btn) {
        btn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}


// ===== Toggle Password Visibility =====
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'fas fa-eye';
    }
}

// ===== Fill Demo Account =====
function fillDemo(username, password) {
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
    
    // Visual feedback
    const btn = event.target.closest('.demo-btn');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => btn.style.transform = '', 150);
}

// ===== Check Remembered User =====
function checkRememberedUser() {
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
        const user = JSON.parse(remembered);
        document.getElementById('username').value = user.username;
        document.getElementById('rememberMe').checked = true;
    }
}

// ===== Handle Login =====
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const errorDiv = document.getElementById('loginError');
    const errorMsg = document.getElementById('errorMessage');
    
    // Hide previous error
    errorDiv.classList.remove('show');
    
    // Find user
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Save session
        const sessionData = {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(sessionData));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Remember user if checked
        if (rememberMe) {
            localStorage.setItem('rememberedUser', JSON.stringify({ username }));
        } else {
            localStorage.removeItem('rememberedUser');
        }
        
        // Redirect to dashboard
        window.location.href = 'index.html';
        
    } else {
        // Show error
        errorMsg.textContent = 'Sai tên đăng nhập hoặc mật khẩu!';
        errorDiv.classList.add('show');
        
        // Shake animation on inputs
        document.getElementById('username').style.animation = 'shake 0.5s ease';
        document.getElementById('password').style.animation = 'shake 0.5s ease';
        
        setTimeout(() => {
            document.getElementById('username').style.animation = '';
            document.getElementById('password').style.animation = '';
        }, 500);
    }
}

// ===== Logout Function =====
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

// ===== Check Auth (for protected pages) =====
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || !currentUser) {
        window.location.href = 'login.html';
        return null;
    }
    
    return JSON.parse(currentUser);
}

// ===== Get Current User =====
function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

// ===== Check Permission =====
function hasPermission(permission) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const userRole = rolePermissions[user.role];
    if (!userRole) return false;
    
    // Admin has all permissions
    if (userRole.permissions.includes('all')) return true;
    
    return userRole.permissions.includes(permission);
}

// ===== Check Menu Access =====
function canAccessMenu(menuItem) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const userRole = rolePermissions[user.role];
    return userRole ? userRole.menuItems.includes(menuItem) : false;
}
