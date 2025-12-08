// ===== Data Storage =====
let members = JSON.parse(localStorage.getItem('gymMembers')) || [];
let packages = [
    { id: 1, name: 'Gói 1 tháng', duration: 30, price: 500000 },
    { id: 2, name: 'Gói 3 tháng', duration: 90, price: 1200000 },
    { id: 3, name: 'Gói 6 tháng', duration: 180, price: 2000000 },
    { id: 4, name: 'Gói 12 tháng', duration: 365, price: 3500000 }
];

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function() {
    // Set default date
    document.getElementById('startDate').valueAsDate = new Date();
    
    // Load initial data
    if (members.length === 0) {
        loadSampleData();
    }
    
    renderMembers();
    renderPackages();
    renderExpiringMembers();
    updateStats();
    
    // Menu toggle for mobile
    document.querySelector('.menu-toggle').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });
});

// ===== Sample Data =====
function loadSampleData() {
    const sampleMembers = [
        {
            id: 1,
            name: 'Nguyễn Văn An',
            phone: '0901234567',
            email: 'an.nguyen@email.com',
            gender: 'male',
            cardId: 'GYM001',
            packageId: 3,
            packageName: 'Gói 6 tháng',
            startDate: '2024-10-01',
            endDate: '2025-04-01',
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            name: 'Trần Thị Bình',
            phone: '0912345678',
            email: 'binh.tran@email.com',
            gender: 'female',
            cardId: 'GYM002',
            packageId: 2,
            packageName: 'Gói 3 tháng',
            startDate: '2024-11-15',
            endDate: '2025-02-15',
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            name: 'Lê Minh Cường',
            phone: '0923456789',
            email: 'cuong.le@email.com',
            gender: 'male',
            cardId: 'GYM003',
            packageId: 4,
            packageName: 'Gói 12 tháng',
            startDate: '2024-06-01',
            endDate: '2025-06-01',
            createdAt: new Date().toISOString()
        },
        {
            id: 4,
            name: 'Phạm Thu Dung',
            phone: '0934567890',
            email: 'dung.pham@email.com',
            gender: 'female',
            cardId: 'GYM004',
            packageId: 1,
            packageName: 'Gói 1 tháng',
            startDate: '2024-12-01',
            endDate: '2024-12-31',
            createdAt: new Date().toISOString()
        },
        {
            id: 5,
            name: 'Hoàng Văn Em',
            phone: '0945678901',
            email: 'em.hoang@email.com',
            gender: 'male',
            cardId: 'GYM005',
            packageId: 2,
            packageName: 'Gói 3 tháng',
            startDate: '2024-09-01',
            endDate: '2024-12-01',
            createdAt: new Date().toISOString()
        }
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
    
    tbody.innerHTML = filteredMembers.map(member => {
        const status = getMemberStatus(member.endDate);
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=${member.gender === 'male' ? '3b82f6' : 'ec4899'}&color=fff`;
        
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
    }).join('');
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
                    <button class="btn btn-primary btn-sm" onclick="openRenewModal(${member.id})">
                        Gia hạn
                    </button>
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
    
    // Reset forms
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
    
    // Validation
    if (!name || !phone || !email || !gender || !packageId || !startDate || !endDate) {
        showToast('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }
    
    // Check duplicate phone/email
    if (members.some(m => m.phone === phone)) {
        showToast('Số điện thoại đã tồn tại!', 'error');
        return;
    }
    
    if (members.some(m => m.email === email)) {
        showToast('Email đã tồn tại!', 'error');
        return;
    }
    
    const newMember = {
        id: Date.now(),
        name,
        phone,
        email,
        gender,
        cardId: generateCardId(),
        packageId,
        packageName,
        startDate,
        endDate,
        createdAt: new Date().toISOString()
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
    
    // Check duplicate (exclude current member)
    if (members.some(m => m.id !== id && m.phone === phone)) {
        showToast('Số điện thoại đã tồn tại!', 'error');
        return;
    }
    
    if (members.some(m => m.id !== id && m.email === email)) {
        showToast('Email đã tồn tại!', 'error');
        return;
    }
    
    members[memberIndex] = {
        ...members[memberIndex],
        name,
        phone,
        email,
        startDate,
        endDate
    };
    
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
    
    // Calculate new end date from current end date or today (whichever is later)
    const currentEndDate = new Date(members[memberIndex].endDate);
    const today = new Date();
    const baseDate = currentEndDate > today ? currentEndDate : today;
    
    const newEndDate = new Date(baseDate);
    newEndDate.setDate(newEndDate.getDate() + duration);
    
    members[memberIndex] = {
        ...members[memberIndex],
        packageId,
        packageName,
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

// ===== Search Members =====
document.querySelector('.search-box input').addEventListener('input', function(e) {
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
    
    tbody.innerHTML = filteredMembers.map(member => {
        const status = getMemberStatus(member.endDate);
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=${member.gender === 'male' ? '3b82f6' : 'ec4899'}&color=fff`;
        
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
    }).join('');
});

// ===== Close modal on Escape key =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal.id);
        });
    }
});
