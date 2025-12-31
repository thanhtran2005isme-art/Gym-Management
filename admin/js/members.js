// ===== Members Page JavaScript =====

// Data
let members = JSON.parse(localStorage.getItem('gymMembers')) || [];
const packages = [
    { id: 1, name: 'Gói 1 tháng', duration: 30, price: 500000 },
    { id: 2, name: 'Gói 3 tháng', duration: 90, price: 1200000 },
    { id: 3, name: 'Gói 6 tháng', duration: 180, price: 2000000 },
    { id: 4, name: 'Gói 12 tháng', duration: 365, price: 3500000 }
];

const roleConfig = {
    admin: { label: 'Quản trị viên', menuItems: ['dashboard','members','packages','trainers','schedule','checkin','facilities','invoices','reports','settings'] },
    trainer: { label: 'Huấn luyện viên', menuItems: ['dashboard','schedule','members','checkin'] }
};

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function() {
    const user = checkAuth();
    if (!user) return;
    
    initTheme();
    initSidebar();
    initUserInfo(user);
    initMenuByRole(user.role);
    
    if (members.length === 0) loadSampleData();
    
    document.getElementById('startDate').valueAsDate = new Date();
    renderMembers();
    updateStats();
    initEventListeners();
});

// ===== Auth =====
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    if (!isLoggedIn || !currentUser) { window.location.href = 'login.html'; return null; }
    return JSON.parse(currentUser);
}

function confirmLogout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
    }
}

// ===== Theme =====
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('themeIcon').className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    document.getElementById('themeText').textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
}


function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    document.getElementById('themeIcon').className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    document.getElementById('themeText').textContent = newTheme === 'dark' ? 'Dark Mode' : 'Light Mode';
}

// ===== Sidebar =====
function initSidebar() {
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        document.getElementById('sidebar').classList.add('collapsed');
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
}

function initUserInfo(user) {
    document.querySelector('.user-name').textContent = user.name;
    document.querySelector('.user-role').textContent = roleConfig[user.role]?.label || user.role;
    document.querySelector('.user-info img').src = user.avatar;
}

function initMenuByRole(role) {
    const allowed = roleConfig[role]?.menuItems || [];
    document.querySelectorAll('.nav-item').forEach(item => {
        const page = item.dataset.page;
        if (page && !allowed.includes(page)) item.style.display = 'none';
    });
    document.querySelectorAll('.nav-section').forEach(section => {
        if (section.querySelectorAll('.nav-item:not([style*="display: none"])').length === 0) section.style.display = 'none';
    });
}

// ===== Event Listeners =====
function initEventListeners() {
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('sidebarCollapseBtn').addEventListener('click', toggleSidebar);
    document.getElementById('menuToggle').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('active'));
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.modal.active').forEach(m => closeModal(m.id)); });
}

// ===== Helpers =====
function getMemberStatus(endDate) {
    const today = new Date(); today.setHours(0,0,0,0);
    const end = new Date(endDate); end.setHours(0,0,0,0);
    const diff = Math.ceil((end - today) / (1000*60*60*24));
    if (diff < 0) return 'expired';
    if (diff <= 7) return 'expiring';
    return 'active';
}

function getStatusText(s) { return s === 'active' ? 'Còn hạn' : s === 'expiring' ? 'Sắp hết hạn' : 'Hết hạn'; }
function formatDate(d) { return new Date(d).toLocaleDateString('vi-VN'); }
function formatCurrency(a) { return new Intl.NumberFormat('vi-VN').format(a) + 'đ'; }
function saveMembers() { localStorage.setItem('gymMembers', JSON.stringify(members)); }
function generateCardId() {
    const last = members.length > 0 ? Math.max(...members.map(m => parseInt(m.cardId.replace('GYM','')))) : 0;
    return 'GYM' + String(last + 1).padStart(3, '0');
}


// ===== Render Members =====
function renderMembers() {
    const statusFilter = document.getElementById('filterStatus').value;
    const packageFilter = document.getElementById('filterPackage').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    let filtered = [...members];
    
    if (statusFilter !== 'all') filtered = filtered.filter(m => getMemberStatus(m.endDate) === statusFilter);
    if (packageFilter !== 'all') filtered = filtered.filter(m => m.packageId == packageFilter);
    if (searchTerm) filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(searchTerm) || m.email.toLowerCase().includes(searchTerm) ||
        m.phone.includes(searchTerm) || m.cardId.toLowerCase().includes(searchTerm)
    );
    
    const tbody = document.getElementById('membersTableBody');
    document.getElementById('showingCount').textContent = filtered.length;
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state"><i class="fas fa-users"></i><h3>Không có hội viên</h3></div></td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(m => {
        const status = getMemberStatus(m.endDate);
        const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=${m.gender==='male'?'3b82f6':'ec4899'}&color=fff`;
        return `<tr>
            <td><input type="checkbox" class="member-checkbox" data-id="${m.id}"></td>
            <td><div class="member-cell"><img src="${avatar}" class="member-avatar"><div class="member-info"><span class="member-name">${m.name}</span></div></div></td>
            <td><span class="card-id">${m.cardId}</span></td>
            <td>${m.phone}</td>
            <td>${m.email}</td>
            <td>${m.packageName}</td>
            <td>${formatDate(m.endDate)}</td>
            <td><span class="status-badge ${status}">${getStatusText(status)}</span></td>
            <td><div class="action-buttons">
                <button class="action-btn edit" onclick="editMember(${m.id})" title="Sửa"><i class="fas fa-edit"></i></button>
                <button class="action-btn renew" onclick="openRenewModal(${m.id})" title="Gia hạn"><i class="fas fa-sync"></i></button>
                <button class="action-btn delete" onclick="deleteMember(${m.id})" title="Xóa"><i class="fas fa-trash"></i></button>
            </div></td>
        </tr>`;
    }).join('');
}

function filterMembers() { renderMembers(); }
function handleSearch() { renderMembers(); }
function toggleSelectAll() {
    const checked = document.getElementById('selectAll').checked;
    document.querySelectorAll('.member-checkbox').forEach(cb => cb.checked = checked);
}

// ===== Update Stats =====
function updateStats() {
    const total = members.length;
    const active = members.filter(m => getMemberStatus(m.endDate) === 'active').length;
    const expiring = members.filter(m => getMemberStatus(m.endDate) === 'expiring').length;
    const expired = members.filter(m => getMemberStatus(m.endDate) === 'expired').length;
    
    document.getElementById('totalCount').textContent = total;
    document.getElementById('activeCount').textContent = active;
    document.getElementById('expiringCount').textContent = expiring;
    document.getElementById('expiredCount').textContent = expired;
    document.getElementById('membersBadge').textContent = total;
}


// ===== Modal Functions =====
function openModal(id) { document.getElementById(id).classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { 
    document.getElementById(id).classList.remove('active'); 
    document.body.style.overflow = '';
    if (id === 'addMemberModal') {
        document.getElementById('addMemberForm').reset();
        document.getElementById('startDate').valueAsDate = new Date();
    }
}

function updateEndDate() {
    const pkg = document.getElementById('memberPackage');
    const start = document.getElementById('startDate');
    const opt = pkg.options[pkg.selectedIndex];
    const duration = parseInt(opt.dataset.duration) || 0;
    const price = parseInt(opt.dataset.price) || 0;
    if (start.value && duration > 0) {
        const end = new Date(start.value);
        end.setDate(end.getDate() + duration);
        document.getElementById('endDate').value = end.toISOString().split('T')[0];
    }
    document.getElementById('totalAmount').value = price > 0 ? formatCurrency(price) : '';
}

// ===== CRUD =====
function addMember(e) {
    e.preventDefault();
    const name = document.getElementById('memberName').value.trim();
    const phone = document.getElementById('memberPhone').value.trim();
    const email = document.getElementById('memberEmail').value.trim();
    const gender = document.getElementById('memberGender').value;
    const pkg = document.getElementById('memberPackage');
    const packageId = parseInt(pkg.value);
    const packageName = pkg.options[pkg.selectedIndex].text.split(' - ')[0];
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (members.some(m => m.phone === phone)) { showToast('Số điện thoại đã tồn tại!', 'error'); return; }
    if (members.some(m => m.email === email)) { showToast('Email đã tồn tại!', 'error'); return; }
    
    const newMember = { id: Date.now(), name, phone, email, gender, cardId: generateCardId(), packageId, packageName, startDate, endDate, createdAt: new Date().toISOString() };
    members.push(newMember);
    saveMembers();
    closeModal('addMemberModal');
    renderMembers();
    updateStats();
    showToast(`Đăng ký thành công! Mã thẻ: ${newMember.cardId}`, 'success');
}

function editMember(id) {
    const m = members.find(x => x.id === id);
    if (!m) return;
    document.getElementById('editMemberId').value = m.id;
    document.getElementById('editMemberName').value = m.name;
    document.getElementById('editMemberPhone').value = m.phone;
    document.getElementById('editMemberEmail').value = m.email;
    document.getElementById('editCardId').value = m.cardId;
    document.getElementById('editStartDate').value = m.startDate;
    document.getElementById('editEndDate').value = m.endDate;
    openModal('editMemberModal');
}

function updateMember(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('editMemberId').value);
    const idx = members.findIndex(m => m.id === id);
    if (idx === -1) return;
    members[idx] = { ...members[idx],
        name: document.getElementById('editMemberName').value.trim(),
        phone: document.getElementById('editMemberPhone').value.trim(),
        email: document.getElementById('editMemberEmail').value.trim(),
        startDate: document.getElementById('editStartDate').value,
        endDate: document.getElementById('editEndDate').value
    };
    saveMembers(); closeModal('editMemberModal'); renderMembers(); updateStats();
    showToast('Cập nhật thành công!', 'success');
}

function deleteMember(id) {
    const m = members.find(x => x.id === id);
    if (m && confirm(`Xóa hội viên "${m.name}"?`)) {
        members = members.filter(x => x.id !== id);
        saveMembers(); renderMembers(); updateStats();
        showToast('Đã xóa hội viên!', 'success');
    }
}


// ===== Renew =====
function openRenewModal(id) {
    const m = members.find(x => x.id === id);
    if (!m) return;
    document.getElementById('renewMemberId').value = m.id;
    document.getElementById('renewMemberInfo').innerHTML = `
        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=6366f1&color=fff">
        <div class="info"><h4>${m.name}</h4><p>Mã: ${m.cardId} | Hết hạn: ${formatDate(m.endDate)}</p></div>`;
    document.getElementById('renewPackage').value = '';
    openModal('renewModal');
}

function renewMembership(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('renewMemberId').value);
    const idx = members.findIndex(m => m.id === id);
    if (idx === -1) return;
    const pkg = document.getElementById('renewPackage');
    const opt = pkg.options[pkg.selectedIndex];
    const duration = parseInt(opt.dataset.duration);
    if (!pkg.value) { showToast('Chọn gói gia hạn!', 'error'); return; }
    
    const base = new Date(members[idx].endDate) > new Date() ? new Date(members[idx].endDate) : new Date();
    const newEnd = new Date(base);
    newEnd.setDate(newEnd.getDate() + duration);
    
    members[idx] = { ...members[idx], packageId: parseInt(pkg.value), packageName: opt.text.split(' - ')[0],
        startDate: base.toISOString().split('T')[0], endDate: newEnd.toISOString().split('T')[0] };
    saveMembers(); closeModal('renewModal'); renderMembers(); updateStats();
    showToast(`Gia hạn thành công! Hạn mới: ${formatDate(newEnd)}`, 'success');
}

// ===== Export =====
function exportMembers() {
    showToast('Tính năng xuất Excel đang phát triển!', 'success');
}

// ===== Toast =====
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    toast.className = 'toast ' + type;
    document.getElementById('toastMessage').textContent = msg;
    toast.querySelector('i').className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== Sample Data =====
function loadSampleData() {
    members = [
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
        { id: 11, name: 'Trịnh Văn Long', phone: '0901111111', email: 'long.trinh@email.com', gender: 'male', cardId: 'GYM011', packageId: 1, packageName: 'Gói 1 tháng', startDate: '2024-11-10', endDate: '2024-12-10', createdAt: '2024-11-10' },
        { id: 12, name: 'Mai Thị Ngọc', phone: '0902222222', email: 'ngoc.mai@email.com', gender: 'female', cardId: 'GYM012', packageId: 2, packageName: 'Gói 3 tháng', startDate: '2024-09-12', endDate: '2024-12-12', createdAt: '2024-09-12' },
        { id: 13, name: 'Cao Văn Oanh', phone: '0903333333', email: 'oanh.cao@email.com', gender: 'male', cardId: 'GYM013', packageId: 1, packageName: 'Gói 1 tháng', startDate: '2024-11-14', endDate: '2024-12-14', createdAt: '2024-11-14' },
        { id: 14, name: 'Đinh Thị Phúc', phone: '0904444444', email: 'phuc.dinh@email.com', gender: 'female', cardId: 'GYM014', packageId: 1, packageName: 'Gói 1 tháng', startDate: '2024-10-01', endDate: '2024-11-01', createdAt: '2024-10-01' },
        { id: 15, name: 'Tạ Văn Quân', phone: '0905555555', email: 'quan.ta@email.com', gender: 'male', cardId: 'GYM015', packageId: 2, packageName: 'Gói 3 tháng', startDate: '2024-06-01', endDate: '2024-09-01', createdAt: '2024-06-01' }
    ];
    saveMembers();
}
