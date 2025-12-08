// ===== Data Storage =====
let members = JSON.parse(localStorage.getItem('gymMembers')) || [];
let packages = [
    { id: 1, name: 'Gói 1 tháng', duration: 30, price: 500000 },
    { id: 2, name: 'Gói 3 tháng', duration: 90, price: 1200000 },
    { id: 3, name: 'Gói 6 tháng', duration: 180, price: 2000000 },
    { id: 4, name: 'Gói 12 tháng', duration: 365, price: 3500000 }
];

// ===== Role Config =====
const roleConfig = {
    admin: {
        label: 'Quản trị viên',
        menuItems: ['dashboard', 'members', 'packages', 'trainers', 'schedule', 'checkin', 'facilities', 'invoices', 'reports', 'settings']
    },
    trainer: {
        label: 'Huấn luyện viên', 
        menuItems: ['dashboard', 'schedule', 'members', 'checkin']
    }
};

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const user = checkAuth();
    if (!user) return;
    
    // Set default date
    document.getElementById('startDate').valueAsDate = new Date();
    
    // Load initial data
    if (members.length === 0) {
        loadSampleData();
    }
    
    // Initialize UI
    initTheme();
    initSidebar();
    initCurrentDate();
    initUserInfo(user);
    initMenuByRole(user.role);
    
    renderMembers();
    renderPackages();
    renderExpiringMembers();
    updateStats();
    
    // Event listeners
    initEventListeners();
});

// ===== Theme Management =====
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-moon';
        themeText.textContent = 'Dark Mode';
    } else {
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = 'Light Mode';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    showToast(`Đã chuyển sang ${newTheme === 'dark' ? 'chế độ tối' : 'chế độ sáng'}`, 'success');
}

// ===== Sidebar Management =====
function initSidebar() {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === 'true') {
        document.getElementById('sidebar').classList.add('collapsed');
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// ===== Current Date =====
function initCurrentDate() {
    const dateEl = document.getElementById('currentDate');
    if (dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = new Date().toLocaleDateString('vi-VN', options);
    }
}

// ===== Init User Info =====
function initUserInfo(user) {
    // Update sidebar user info
    const userName = document.querySelector('.user-name');
    const userRole = document.querySelector('.user-role');
    const userAvatar = document.querySelector('.user-info img');
    
    if (userName) userName.textContent = user.name;
    if (userRole) userRole.textContent = roleConfig[user.role]?.label || user.role;
    if (userAvatar) userAvatar.src = user.avatar;
    
    // Update welcome message
    const welcomeH1 = document.querySelector('.welcome-content h1');
    if (welcomeH1) {
        welcomeH1.textContent = `Chào mừng trở lại, ${user.name.split(' ').pop()}! 👋`;
    }
}

// ===== Init Menu By Role =====
function initMenuByRole(role) {
    const allowedMenus = roleConfig[role]?.menuItems || [];
    
    document.querySelectorAll('.nav-item').forEach(item => {
        const page = item.dataset.page;
        if (page && !allowedMenus.includes(page)) {
            item.style.display = 'none';
        }
    });
    
    // Hide sections if all items are hidden
    document.querySelectorAll('.nav-section').forEach(section => {
        const visibleItems = section.querySelectorAll('.nav-item:not([style*="display: none"])');
        if (visibleItems.length === 0) {
            section.style.display = 'none';
        }
    });
    
    // Hide admin-only buttons for non-admin
    if (role !== 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    }
}

// ===== Check Auth =====
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || !currentUser) {
        window.location.href = 'login.html';
        return null;
    }
    
    return JSON.parse(currentUser);
}

// ===== Logout =====
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

// ===== Confirm Logout =====
function confirmLogout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        showToast('Đang đăng xuất...', 'success');
        setTimeout(() => {
            logout();
        }, 500);
    }
}

// ===== Event Listeners =====
function initEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Sidebar collapse
    document.getElementById('sidebarCollapseBtn').addEventListener('click', toggleSidebar);
    
    // Mobile menu toggle
    document.getElementById('menuToggle').addEventListener('click', toggleMobileSidebar);
    
    // Fullscreen toggle
    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
    
    // Navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile sidebar
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('active');
            }
        });
    });
    
    // Search box
    document.querySelector('.search-box input').addEventListener('input', handleSearch);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Close modal on Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
}

// ===== Fullscreen =====
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// ===== Keyboard Shortcuts =====
function handleKeyboardShortcuts(e) {
    // Ctrl+K for search
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.search-box input').focus();
    }
    
    // Ctrl+N for new member
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        openModal('addMemberModal');
    }
}

// ===== Search Handler =====
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderMembers();
        return;
    }
    
    const filteredMembers = members.filter(m => 
        m.name.toLowerCase().includes(searchTerm) ||
        m.email.toLowerCase().includes(searchTerm) ||
        m.phone.includes(searchTerm) ||
        m.cardId.toLowerCase().includes(searchTerm)
    );
    
    renderFilteredMembers(filteredMembers, searchTerm);
}


// ===== Member Status Constants =====
const MEMBER_STATUS = {
    ACTIVE: 'active',
    EXPIRING: 'expiring',      // Còn <= 7 ngày
    EXPIRED: 'expired'
};

// ===== Sample Data - 20 Hội viên =====
function loadSampleData() {
    const sampleMembers = [
        // Hội viên còn hạn (ACTIVE)
        { id: 1, name: 'Nguyễn Văn An', phone: '0901234567', email: 'an.nguyen@email.com', gender: 'male', cardId: 'GYM001', packageId: 4, packageName: 'Gói 12 tháng', startDate: '2024-06-01', endDate: '2025-06-01', createdAt: '2024-06-01' },
        { id: 2, name: 'Trần Thị Bình', phone: '0912345678', email: 'binh.tran@email.com', gender: 'female', cardId: 'GYM002', packageId: 3, packageName: 'Gói 6 tháng', startDate: '2024-09-01', endDate: '2025-03-01', createdAt: '2024-09-01' },
        { id: 3, name: 'Lê Minh Cường', phone: '0923456789', email: 'cuong.le@email.com', gender: 'male', cardId: 'GYM003', packageId: 4, packageName: 'Gói 12 tháng', startDate: '2024-03-15', endDate: '2025-03-15', createdAt: '2024-03-15' },
        { id: 4, name: 'Phạm Thu Dung', phone: '0934567890', email: 'dung.pham@email.com', gender: 'female', cardId: 'GYM004', packageId: 3, packageName: 'Gói 6 tháng', startDate: '2024-08-01', endDate: '2025-02-01', createdAt: '2024-08-01' },
        { id: 5, name: 'Hoàng Văn Em', phone: '0945678901', email: 'em.hoang@email.com', gender: 'male', cardId: 'GYM005', packageId: 4, packageName: 'Gói 12 tháng', startDate: '2024-05-01', endDate: '2025-05-01', createdAt: '2024-05-01' },
        { id: 6, name: 'Vũ Thị Phương', phone: '0956789012', email: 'phuong.vu@email.com', gender: 'female', cardId: 'GYM006', packageId: 3, packageName: 'Gói 6 tháng', startDate: '2024-10-01', endDate: '2025-04-01', createdAt: '2024-10-01' },
        { id: 7, name: 'Đặng Quốc Giang', phone: '0967890123', email: 'giang.dang@email.com', gender: 'male', cardId: 'GYM007', packageId: 4, packageName: 'Gói 12 tháng', startDate: '2024-04-01', endDate: '2025-04-01', createdAt: '2024-04-01' },
        { id: 8, name: 'Bùi Thị Hạnh', phone: '0978901234', email: 'hanh.bui@email.com', gender: 'female', cardId: 'GYM008', packageId: 2, packageName: 'Gói 3 tháng', startDate: '2024-11-01', endDate: '2025-02-01', createdAt: '2024-11-01' },
        { id: 9, name: 'Ngô Văn Inh', phone: '0989012345', email: 'inh.ngo@email.com', gender: 'male', cardId: 'GYM009', packageId: 3, packageName: 'Gói 6 tháng', startDate: '2024-07-15', endDate: '2025-01-15', createdAt: '2024-07-15' },
        { id: 10, name: 'Lý Thị Kim', phone: '0990123456', email: 'kim.ly@email.com', gender: 'female', cardId: 'GYM010', packageId: 4, packageName: 'Gói 12 tháng', startDate: '2024-02-01', endDate: '2025-02-01', createdAt: '2024-02-01' },
        
        // Hội viên sắp hết hạn (EXPIRING - trong 7 ngày tới)
        { id: 11, name: 'Trịnh Văn Long', phone: '0901111111', email: 'long.trinh@email.com', gender: 'male', cardId: 'GYM011', packageId: 1, packageName: 'Gói 1 tháng', startDate: '2024-11-10', endDate: '2024-12-10', createdAt: '2024-11-10' },
        { id: 12, name: 'Mai Thị Ngọc', phone: '0902222222', email: 'ngoc.mai@email.com', gender: 'female', cardId: 'GYM012', packageId: 2, packageName: 'Gói 3 tháng', startDate: '2024-09-12', endDate: '2024-12-12', createdAt: '2024-09-12' },
        { id: 13, name: 'Cao Văn Oanh', phone: '0903333333', email: 'oanh.cao@email.com', gender: 'male', cardId: 'GYM013', packageId: 1, packageName: 'Gói 1 tháng', startDate: '2024-11-14', endDate: '2024-12-14', createdAt: '2024-11-14' },
        
        // Hội viên hết hạn (EXPIRED)
        { id: 14, name: 'Đinh Thị Phúc', phone: '0904444444', email: 'phuc.dinh@email.com', gender: 'female', cardId: 'GYM014', packageId: 1, packageName: 'Gói 1 tháng', startDate: '2024-10-01', endDate: '2024-11-01', createdAt: '2024-10-01' },
        { id: 15, name: 'Tạ Văn Quân', phone: '0905555555', email: 'quan.ta@email.com', gender: 'male', cardId: 'GYM015', packageId: 2, packageName: 'Gói 3 tháng', startDate: '2024-06-01', endDate: '2024-09-01', createdAt: '2024-06-01' },
        { id: 16, name: 'Hồ Thị Rạng', phone: '0906666666', email: 'rang.ho@email.com', gender: 'female', cardId: 'GYM016', packageId: 1, packageName: 'Gói 1 tháng', startDate: '2024-10-15', endDate: '2024-11-15', createdAt: '2024-10-15' },
        
        // Thêm hội viên mới
        { id: 17, name: 'Dương Văn Sơn', phone: '0907777777', email: 'son.duong@email.com', gender: 'male', cardId: 'GYM017', packageId: 4, packageName: 'Gói 12 tháng', startDate: '2024-11-01', endDate: '2025-11-01', createdAt: '2024-11-01' },
        { id: 18, name: 'Phan Thị Tâm', phone: '0908888888', email: 'tam.phan@email.com', gender: 'female', cardId: 'GYM018', packageId: 3, packageName: 'Gói 6 tháng', startDate: '2024-11-15', endDate: '2025-05-15', createdAt: '2024-11-15' },
        { id: 19, name: 'Võ Văn Uy', phone: '0909999999', email: 'uy.vo@email.com', gender: 'male', cardId: 'GYM019', packageId: 2, packageName: 'Gói 3 tháng', startDate: '2024-10-20', endDate: '2025-01-20', createdAt: '2024-10-20' },
        { id: 20, name: 'Châu Thị Vân', phone: '0910000000', email: 'van.chau@email.com', gender: 'female', cardId: 'GYM020', packageId: 4, packageName: 'Gói 12 tháng', startDate: '2024-12-01', endDate: '2025-12-01', createdAt: '2024-12-01' }
    ];
    members = sampleMembers;
    saveMembers();
}

// ===== Save to LocalStorage =====
function saveMembers() {
    localStorage.setItem('gymMembers', JSON.stringify(members));
}

// ===== Generate Card ID =====
function generateCardId() {
    const lastId = members.length > 0 ? Math.max(...members.map(m => parseInt(m.cardId.replace('GYM', '')))) : 0;
    return 'GYM' + String(lastId + 1).padStart(3, '0');
}

// ===== Get Member Status =====
function getMemberStatus(endDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'expired';
    if (diffDays <= 7) return 'expiring';
    return 'active';
}

// ===== Get Status Text =====
function getStatusText(status) {
    switch(status) {
        case 'active': return 'Còn hạn';
        case 'expiring': return 'Sắp hết hạn';
        case 'expired': return 'Hết hạn';
        default: return '';
    }
}


// ===== Format Date =====
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
}

// ===== Format Currency =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

// ===== Render Members Table =====
function renderMembers(filter = 'all') {
    const tbody = document.getElementById('membersTableBody');
    let filteredMembers = [...members];
    
    if (filter !== 'all') {
        filteredMembers = members.filter(m => getMemberStatus(m.endDate) === filter);
    }
    
    if (filteredMembers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <h3>Chưa có hội viên</h3>
                        <p>Nhấn "Thêm hội viên" để đăng ký hội viên mới</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredMembers.map(member => createMemberRow(member)).join('');
}

// ===== Render Filtered Members =====
function renderFilteredMembers(filteredMembers, searchTerm) {
    const tbody = document.getElementById('membersTableBody');
    
    if (filteredMembers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>Không tìm thấy kết quả</h3>
                        <p>Thử tìm kiếm với từ khóa khác</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredMembers.map(member => createMemberRow(member)).join('');
}

// ===== Create Member Row =====
function createMemberRow(member) {
    const status = getMemberStatus(member.endDate);
    const avatarBg = member.gender === 'male' ? '3b82f6' : 'ec4899';
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=${avatarBg}&color=fff`;
    
    return `
        <tr>
            <td>
                <div class="member-cell">
                    <img src="${avatarUrl}" alt="${member.name}" class="member-avatar">
                    <div class="member-info">
                        <span class="member-name">${member.name}</span>
                        <span class="member-email">${member.email}</span>
                    </div>
                </div>
            </td>
            <td><span class="card-id">${member.cardId}</span></td>
            <td>${member.packageName}</td>
            <td>${formatDate(member.startDate)}</td>
            <td>${formatDate(member.endDate)}</td>
            <td><span class="status-badge ${status}">${getStatusText(status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editMember(${member.id})" title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn renew" onclick="openRenewModal(${member.id})" title="Gia hạn">
                        <i class="fas fa-sync"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteMember(${member.id})" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}


// ===== Render Packages =====
function renderPackages() {
    const container = document.getElementById('packageList');
    container.innerHTML = packages.map(pkg => `
        <div class="package-item">
            <div class="package-info">
                <h4>${pkg.name}</h4>
                <p>${pkg.duration} ngày</p>
            </div>
            <span class="package-price">${formatCurrency(pkg.price)}</span>
        </div>
    `).join('');
}

// ===== Render Expiring Members =====
function renderExpiringMembers() {
    const container = document.getElementById('expiringList');
    const expiringMembers = members.filter(m => {
        const status = getMemberStatus(m.endDate);
        return status === 'expiring' || status === 'expired';
    }).slice(0, 5);
    
    if (expiringMembers.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding: 24px;">
                <i class="fas fa-check-circle" style="color: var(--success);"></i>
                <p>Không có thẻ sắp hết hạn</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = expiringMembers.map(member => {
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=f59e0b&color=fff`;
        const daysLeft = Math.ceil((new Date(member.endDate) - new Date()) / (1000 * 60 * 60 * 24));
        const daysText = daysLeft < 0 ? `Hết hạn ${Math.abs(daysLeft)} ngày` : `Còn ${daysLeft} ngày`;
        
        return `
            <div class="expiring-item">
                <img src="${avatarUrl}" alt="${member.name}">
                <div class="expiring-info">
                    <h4>${member.name}</h4>
                    <p><i class="fas fa-clock"></i> ${daysText}</p>
                </div>
                <div class="expiring-action">
                    <button class="btn btn-primary btn-sm" onclick="openRenewModal(${member.id})">Gia hạn</button>
                </div>
            </div>
        `;
    }).join('');
}

// ===== Update Stats =====
function updateStats() {
    const total = members.length;
    const active = members.filter(m => getMemberStatus(m.endDate) === 'active').length;
    const expiring = members.filter(m => {
        const status = getMemberStatus(m.endDate);
        return status === 'expiring' || status === 'expired';
    }).length;
    
    document.getElementById('totalMembers').textContent = total;
    document.getElementById('activeCards').textContent = active;
    document.getElementById('expiringCards').textContent = expiring;
    
    // Update sidebar badge
    const membersBadge = document.getElementById('membersBadge');
    if (membersBadge) membersBadge.textContent = total;
}

// ===== Filter Members =====
function filterMembers() {
    const filter = document.getElementById('filterStatus').value;
    renderMembers(filter);
}

// ===== Update End Date =====
function updateEndDate() {
    const packageSelect = document.getElementById('memberPackage');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const totalAmountInput = document.getElementById('totalAmount');
    
    const selectedOption = packageSelect.options[packageSelect.selectedIndex];
    const duration = parseInt(selectedOption.dataset.duration) || 0;
    const price = parseInt(selectedOption.dataset.price) || 0;
    
    if (startDateInput.value && duration > 0) {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + duration);
        endDateInput.value = endDate.toISOString().split('T')[0];
    }
    
    totalAmountInput.value = price > 0 ? formatCurrency(price) : '';
}


// ===== Modal Functions =====
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = '';
    
    if (modalId === 'addMemberModal') {
        document.getElementById('addMemberForm').reset();
        document.getElementById('startDate').valueAsDate = new Date();
        document.getElementById('endDate').value = '';
        document.getElementById('totalAmount').value = '';
    }
}

// ===== Add Member =====
function addMember(event) {
    event.preventDefault();
    
    const name = document.getElementById('memberName').value.trim();
    const phone = document.getElementById('memberPhone').value.trim();
    const email = document.getElementById('memberEmail').value.trim();
    const gender = document.getElementById('memberGender').value;
    const packageSelect = document.getElementById('memberPackage');
    const packageId = parseInt(packageSelect.value);
    const packageName = packageSelect.options[packageSelect.selectedIndex].text.split(' - ')[0];
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!name || !phone || !email || !gender || !packageId || !startDate || !endDate) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }
    
    if (members.some(m => m.phone === phone)) {
        showToast('Số điện thoại đã tồn tại!', 'error');
        return;
    }
    
    if (members.some(m => m.email === email)) {
        showToast('Email đã tồn tại!', 'error');
        return;
    }
    
    const newMember = {
        id: Date.now(), name, phone, email, gender,
        cardId: generateCardId(), packageId, packageName,
        startDate, endDate, createdAt: new Date().toISOString()
    };
    
    members.push(newMember);
    saveMembers();
    
    closeModal('addMemberModal');
    renderMembers();
    renderExpiringMembers();
    updateStats();
    
    showToast(`Đăng ký thành công! Mã thẻ: ${newMember.cardId}`, 'success');
}

// ===== Edit Member =====
function editMember(id) {
    const member = members.find(m => m.id === id);
    if (!member) return;
    
    document.getElementById('editMemberId').value = member.id;
    document.getElementById('editMemberName').value = member.name;
    document.getElementById('editMemberPhone').value = member.phone;
    document.getElementById('editMemberEmail').value = member.email;
    document.getElementById('editCardId').value = member.cardId;
    document.getElementById('editStartDate').value = member.startDate;
    document.getElementById('editEndDate').value = member.endDate;
    
    openModal('editMemberModal');
}

// ===== Update Member =====
function updateMember(event) {
    event.preventDefault();
    
    const id = parseInt(document.getElementById('editMemberId').value);
    const memberIndex = members.findIndex(m => m.id === id);
    if (memberIndex === -1) return;
    
    const name = document.getElementById('editMemberName').value.trim();
    const phone = document.getElementById('editMemberPhone').value.trim();
    const email = document.getElementById('editMemberEmail').value.trim();
    const startDate = document.getElementById('editStartDate').value;
    const endDate = document.getElementById('editEndDate').value;
    
    if (members.some(m => m.id !== id && m.phone === phone)) {
        showToast('Số điện thoại đã tồn tại!', 'error');
        return;
    }
    
    if (members.some(m => m.id !== id && m.email === email)) {
        showToast('Email đã tồn tại!', 'error');
        return;
    }
    
    members[memberIndex] = { ...members[memberIndex], name, phone, email, startDate, endDate };
    
    saveMembers();
    closeModal('editMemberModal');
    renderMembers();
    renderExpiringMembers();
    updateStats();
    
    showToast('Cập nhật thành công!', 'success');
}


// ===== Delete Member =====
function deleteMember(id) {
    const member = members.find(m => m.id === id);
    if (!member) return;
    
    if (confirm(`Bạn có chắc muốn xóa hội viên "${member.name}"?`)) {
        members = members.filter(m => m.id !== id);
        saveMembers();
        renderMembers();
        renderExpiringMembers();
        updateStats();
        showToast('Đã xóa hội viên!', 'success');
    }
}

// ===== Open Renew Modal =====
function openRenewModal(id) {
    const member = members.find(m => m.id === id);
    if (!member) return;
    
    document.getElementById('renewMemberId').value = member.id;
    
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=6366f1&color=fff`;
    document.getElementById('renewMemberInfo').innerHTML = `
        <img src="${avatarUrl}" alt="${member.name}">
        <div class="info">
            <h4>${member.name}</h4>
            <p>Mã thẻ: ${member.cardId} | Hết hạn: ${formatDate(member.endDate)}</p>
        </div>
    `;
    
    document.getElementById('renewPackage').value = '';
    openModal('renewModal');
}

// ===== Renew Membership =====
function renewMembership(event) {
    event.preventDefault();
    
    const id = parseInt(document.getElementById('renewMemberId').value);
    const memberIndex = members.findIndex(m => m.id === id);
    if (memberIndex === -1) return;
    
    const packageSelect = document.getElementById('renewPackage');
    const selectedOption = packageSelect.options[packageSelect.selectedIndex];
    const duration = parseInt(selectedOption.dataset.duration);
    const packageName = selectedOption.text.split(' - ')[0];
    const packageId = parseInt(packageSelect.value);
    
    if (!packageId) {
        showToast('Vui lòng chọn gói gia hạn!', 'error');
        return;
    }
    
    const currentEndDate = new Date(members[memberIndex].endDate);
    const today = new Date();
    const baseDate = currentEndDate > today ? currentEndDate : today;
    
    const newEndDate = new Date(baseDate);
    newEndDate.setDate(newEndDate.getDate() + duration);
    
    members[memberIndex] = {
        ...members[memberIndex],
        packageId, packageName,
        startDate: baseDate.toISOString().split('T')[0],
        endDate: newEndDate.toISOString().split('T')[0]
    };
    
    saveMembers();
    closeModal('renewModal');
    renderMembers();
    renderExpiringMembers();
    updateStats();
    
    showToast(`Gia hạn thành công! Hạn mới: ${formatDate(newEndDate.toISOString())}`, 'success');
}

// ===== Toast Notification =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toast.className = 'toast ' + type;
    toastMessage.textContent = message;
    
    const icon = toast.querySelector('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
