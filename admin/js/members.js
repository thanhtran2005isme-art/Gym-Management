// ===== Data Storage =====
let members = JSON.parse(localStorage.getItem("gymMembers")) || [];
let selectedMembers = [];
let packages = [
  { id: 1, name: "Gói 1 tháng", duration: 30, price: 500000 },
  { id: 2, name: "Gói 3 tháng", duration: 90, price: 1200000 },
  { id: 3, name: "Gói 6 tháng", duration: 180, price: 2000000 },
  { id: 4, name: "Gói 12 tháng", duration: 365, price: 3500000 },
];

// ===== Role Config =====
const roleConfig = {
  admin: {
    label: "Quản trị viên",
    menuItems: [
      "dashboard",
      "members",
      "packages",
      "trainers",
      "schedule",
      "checkin",
      "facilities",
      "invoices",
      "reports",
      "settings",
    ],
  },
  trainer: {
    label: "Huấn luyện viên",
    menuItems: ["dashboard", "schedule", "members", "checkin"],
  },
};

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", function () {
  const user = checkAuth();
  if (!user) return;

  // Set default date
  const startDateEl = document.getElementById("startDate");
  if (startDateEl) startDateEl.valueAsDate = new Date();

  // Load sample data if empty
  if (members.length === 0) loadSampleData();

  // Initialize UI
  initTheme();
  initSidebar();
  initUserInfo(user);
  initMenuByRole(user.role);

  // Render data
  renderMembers();
  updateSummary();

  // Event listeners
  initEventListeners();
});

// ===== Check Auth =====
function checkAuth() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const currentUser = localStorage.getItem("currentUser");
  if (!isLoggedIn || !currentUser) {
    window.location.href = "login.html";
    return null;
  }
  return JSON.parse(currentUser);
}

// ===== Theme Management =====
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const themeIcon = document.getElementById("themeIcon");
  if (themeIcon) {
    if (theme === "dark") {
      themeIcon.className = "fas fa-moon";
    } else {
      themeIcon.className = "fas fa-sun";
    }
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  setTheme(currentTheme === "dark" ? "light" : "dark");
  showToast(
    `Đã chuyển sang ${currentTheme === "dark" ? "chế độ sáng" : "chế độ tối"}`,
    "success"
  );
}

// ===== Admin Dropdown =====
function toggleAdminDropdown() {
  const dropdown = document.querySelector(".admin-dropdown");
  dropdown.classList.toggle("active");
}

// ===== Fullscreen =====
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// ===== Sidebar Management =====
function initSidebar() {
  const savedState = localStorage.getItem("sidebarCollapsed");
  if (savedState === "true")
    document.getElementById("sidebar").classList.add("collapsed");
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
  localStorage.setItem(
    "sidebarCollapsed",
    sidebar.classList.contains("collapsed")
  );
}

function toggleMobileSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
}

// ===== Init User Info =====
function initUserInfo(user) {
  const userName = document.querySelector(".user-name");
  const userRole = document.querySelector(".user-role");
  const userAvatar = document.querySelector(".user-info img");
  if (userName) userName.textContent = user.name;
  if (userRole)
    userRole.textContent = roleConfig[user.role]?.label || user.role;
  if (userAvatar) userAvatar.src = user.avatar;
}

// ===== Init Menu By Role =====
function initMenuByRole(role) {
  const allowedMenus = roleConfig[role]?.menuItems || [];
  document.querySelectorAll(".nav-item").forEach((item) => {
    const page = item.dataset.page;
    if (page && !allowedMenus.includes(page)) item.style.display = "none";
  });
  document.querySelectorAll(".nav-section").forEach((section) => {
    const visibleItems = section.querySelectorAll(
      '.nav-item:not([style*="display: none"])'
    );
    if (visibleItems.length === 0) section.style.display = "none";
  });
  if (role !== "admin") {
    document
      .querySelectorAll(".admin-only")
      .forEach((el) => (el.style.display = "none"));
  }
}

// ===== Logout =====
function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
}

function confirmLogout() {
  if (confirm("Bạn có chắc muốn đăng xuất?")) {
    showToast("Đang đăng xuất...", "success");
    setTimeout(() => logout(), 500);
  }
}

// ===== Event Listeners =====
function initEventListeners() {
  // Theme toggle
  document
    .getElementById("themeToggle")
    ?.addEventListener("click", toggleTheme);

  // Fullscreen
  document
    .getElementById("fullscreenBtn")
    ?.addEventListener("click", toggleFullscreen);

  // Sidebar
  document
    .getElementById("sidebarCollapseBtn")
    ?.addEventListener("click", toggleSidebar);
  document
    .getElementById("menuToggle")
    ?.addEventListener("click", toggleMobileSidebar);

  // Search
  document
    .getElementById("searchInput")
    ?.addEventListener("input", handleSearch);

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    const dropdown = document.querySelector(".admin-dropdown");
    if (dropdown && !dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document
        .querySelectorAll(".modal.active")
        .forEach((modal) => closeModal(modal.id));
    }
    if (e.ctrlKey && e.key === "k") {
      e.preventDefault();
      document.getElementById("searchInput")?.focus();
    }
  });
}

// ===== Sample Data =====
function loadSampleData() {
  const sampleMembers = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      phone: "0901234567",
      email: "an.nguyen@email.com",
      gender: "male",
      cardId: "GYM001",
      packageId: 4,
      packageName: "Gói 12 tháng",
      startDate: "2024-06-01",
      endDate: "2025-06-01",
      createdAt: "2024-06-01",
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      phone: "0912345678",
      email: "binh.tran@email.com",
      gender: "female",
      cardId: "GYM002",
      packageId: 3,
      packageName: "Gói 6 tháng",
      startDate: "2024-09-01",
      endDate: "2025-03-01",
      createdAt: "2024-09-01",
    },
    {
      id: 3,
      name: "Lê Minh Cường",
      phone: "0923456789",
      email: "cuong.le@email.com",
      gender: "male",
      cardId: "GYM003",
      packageId: 4,
      packageName: "Gói 12 tháng",
      startDate: "2024-03-15",
      endDate: "2025-03-15",
      createdAt: "2024-03-15",
    },
    {
      id: 4,
      name: "Phạm Thu Dung",
      phone: "0934567890",
      email: "dung.pham@email.com",
      gender: "female",
      cardId: "GYM004",
      packageId: 3,
      packageName: "Gói 6 tháng",
      startDate: "2024-08-01",
      endDate: "2025-02-01",
      createdAt: "2024-08-01",
    },
    {
      id: 5,
      name: "Hoàng Văn Em",
      phone: "0945678901",
      email: "em.hoang@email.com",
      gender: "male",
      cardId: "GYM005",
      packageId: 4,
      packageName: "Gói 12 tháng",
      startDate: "2024-05-01",
      endDate: "2025-05-01",
      createdAt: "2024-05-01",
    },
    {
      id: 6,
      name: "Vũ Thị Phương",
      phone: "0956789012",
      email: "phuong.vu@email.com",
      gender: "female",
      cardId: "GYM006",
      packageId: 3,
      packageName: "Gói 6 tháng",
      startDate: "2024-10-01",
      endDate: "2025-04-01",
      createdAt: "2024-10-01",
    },
    {
      id: 7,
      name: "Đặng Quốc Giang",
      phone: "0967890123",
      email: "giang.dang@email.com",
      gender: "male",
      cardId: "GYM007",
      packageId: 4,
      packageName: "Gói 12 tháng",
      startDate: "2024-04-01",
      endDate: "2025-04-01",
      createdAt: "2024-04-01",
    },
    {
      id: 8,
      name: "Bùi Thị Hạnh",
      phone: "0978901234",
      email: "hanh.bui@email.com",
      gender: "female",
      cardId: "GYM008",
      packageId: 2,
      packageName: "Gói 3 tháng",
      startDate: "2024-11-01",
      endDate: "2025-02-01",
      createdAt: "2024-11-01",
    },
    {
      id: 9,
      name: "Ngô Văn Inh",
      phone: "0989012345",
      email: "inh.ngo@email.com",
      gender: "male",
      cardId: "GYM009",
      packageId: 3,
      packageName: "Gói 6 tháng",
      startDate: "2024-07-15",
      endDate: "2025-01-15",
      createdAt: "2024-07-15",
    },
    {
      id: 10,
      name: "Lý Thị Kim",
      phone: "0990123456",
      email: "kim.ly@email.com",
      gender: "female",
      cardId: "GYM010",
      packageId: 4,
      packageName: "Gói 12 tháng",
      startDate: "2024-02-01",
      endDate: "2025-02-01",
      createdAt: "2024-02-01",
    },
    {
      id: 11,
      name: "Trịnh Văn Long",
      phone: "0901111111",
      email: "long.trinh@email.com",
      gender: "male",
      cardId: "GYM011",
      packageId: 1,
      packageName: "Gói 1 tháng",
      startDate: "2024-11-28",
      endDate: "2024-12-28",
      createdAt: "2024-11-28",
    },
    {
      id: 12,
      name: "Mai Thị Ngọc",
      phone: "0902222222",
      email: "ngoc.mai@email.com",
      gender: "female",
      cardId: "GYM012",
      packageId: 2,
      packageName: "Gói 3 tháng",
      startDate: "2024-09-30",
      endDate: "2024-12-30",
      createdAt: "2024-09-30",
    },
    {
      id: 13,
      name: "Cao Văn Oanh",
      phone: "0903333333",
      email: "oanh.cao@email.com",
      gender: "male",
      cardId: "GYM013",
      packageId: 1,
      packageName: "Gói 1 tháng",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      createdAt: "2024-12-01",
    },
    {
      id: 14,
      name: "Đinh Thị Phúc",
      phone: "0904444444",
      email: "phuc.dinh@email.com",
      gender: "female",
      cardId: "GYM014",
      packageId: 1,
      packageName: "Gói 1 tháng",
      startDate: "2024-10-01",
      endDate: "2024-11-01",
      createdAt: "2024-10-01",
    },
    {
      id: 15,
      name: "Tạ Văn Quân",
      phone: "0905555555",
      email: "quan.ta@email.com",
      gender: "male",
      cardId: "GYM015",
      packageId: 2,
      packageName: "Gói 3 tháng",
      startDate: "2024-06-01",
      endDate: "2024-09-01",
      createdAt: "2024-06-01",
    },
    {
      id: 16,
      name: "Hồ Thị Rạng",
      phone: "0906666666",
      email: "rang.ho@email.com",
      gender: "female",
      cardId: "GYM016",
      packageId: 1,
      packageName: "Gói 1 tháng",
      startDate: "2024-10-15",
      endDate: "2024-11-15",
      createdAt: "2024-10-15",
    },
    {
      id: 17,
      name: "Dương Văn Sơn",
      phone: "0907777777",
      email: "son.duong@email.com",
      gender: "male",
      cardId: "GYM017",
      packageId: 4,
      packageName: "Gói 12 tháng",
      startDate: "2024-11-01",
      endDate: "2025-11-01",
      createdAt: "2024-11-01",
    },
    {
      id: 18,
      name: "Phan Thị Tâm",
      phone: "0908888888",
      email: "tam.phan@email.com",
      gender: "female",
      cardId: "GYM018",
      packageId: 3,
      packageName: "Gói 6 tháng",
      startDate: "2024-11-15",
      endDate: "2025-05-15",
      createdAt: "2024-11-15",
    },
    {
      id: 19,
      name: "Võ Văn Uy",
      phone: "0909999999",
      email: "uy.vo@email.com",
      gender: "male",
      cardId: "GYM019",
      packageId: 2,
      packageName: "Gói 3 tháng",
      startDate: "2024-10-20",
      endDate: "2025-01-20",
      createdAt: "2024-10-20",
    },
    {
      id: 20,
      name: "Châu Thị Vân",
      phone: "0910000000",
      email: "van.chau@email.com",
      gender: "female",
      cardId: "GYM020",
      packageId: 4,
      packageName: "Gói 12 tháng",
      startDate: "2024-12-01",
      endDate: "2025-12-01",
      createdAt: "2024-12-01",
    },
  ];
  members = sampleMembers;
  saveMembers();
}

// ===== Save to LocalStorage =====
function saveMembers() {
  localStorage.setItem("gymMembers", JSON.stringify(members));
}

// ===== Generate Card ID =====
function generateCardId() {
  const lastId =
    members.length > 0
      ? Math.max(...members.map((m) => parseInt(m.cardId.replace("GYM", ""))))
      : 0;
  return "GYM" + String(lastId + 1).padStart(3, "0");
}

// ===== Get Member Status =====
function getMemberStatus(endDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "expired";
  if (diffDays <= 7) return "expiring";
  return "active";
}

// ===== Get Status Text =====
function getStatusText(status) {
  switch (status) {
    case "active":
      return "Còn hạn";
    case "expiring":
      return "Sắp hết hạn";
    case "expired":
      return "Hết hạn";
    default:
      return "";
  }
}

// ===== Format Date =====
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

// ===== Format Currency =====
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

// ===== Update Summary Stats =====
function updateSummary() {
  const total = members.length;
  const active = members.filter(
    (m) => getMemberStatus(m.endDate) === "active"
  ).length;
  const expiring = members.filter(
    (m) => getMemberStatus(m.endDate) === "expiring"
  ).length;
  const expired = members.filter(
    (m) => getMemberStatus(m.endDate) === "expired"
  ).length;

  document.getElementById("totalCount").textContent = total;
  document.getElementById("activeCount").textContent = active;
  document.getElementById("expiringCount").textContent = expiring;
  document.getElementById("expiredCount").textContent = expired;

  const membersBadge = document.getElementById("membersBadge");
  if (membersBadge) membersBadge.textContent = total;
}

// ===== Render Members Table =====
function renderMembers(filteredList = null) {
  const tbody = document.getElementById("membersTableBody");
  const displayMembers = filteredList || members;

  document.getElementById("showingCount").textContent = displayMembers.length;

  if (displayMembers.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="9">
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <h3>Không có hội viên</h3>
                        <p>Nhấn "Thêm hội viên" để đăng ký mới</p>
                    </div>
                </td>
            </tr>
        `;
    return;
  }

  tbody.innerHTML = displayMembers
    .map((member) => createMemberRow(member))
    .join("");
  updateSelectAllCheckbox();
}

// ===== Create Member Row =====
function createMemberRow(member) {
  const status = getMemberStatus(member.endDate);
  const avatarBg = member.gender === "male" ? "3b82f6" : "ec4899";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    member.name
  )}&background=${avatarBg}&color=fff`;
  const isSelected = selectedMembers.includes(member.id);

  // Nếu hết hạn hoặc sắp hết hạn, cho phép click để gia hạn
  const statusBadgeClass =
    status === "expired" || status === "expiring" ? "clickable" : "";
  const statusBadgeClick =
    status === "expired" || status === "expiring"
      ? `onclick="openRenewModal(${member.id})" title="Click để gia hạn"`
      : "";

  return `
        <tr class="${isSelected ? "selected" : ""}">
            <td><input type="checkbox" class="member-checkbox" data-id="${
              member.id
            }" ${isSelected ? "checked" : ""} onchange="toggleMemberSelect(${
    member.id
  })"></td>
            <td>
                <div class="member-cell">
                    <img src="${avatarUrl}" alt="${
    member.name
  }" class="member-avatar">
                    <div class="member-info">
                        <span class="member-name">${member.name}</span>
                        <span class="member-gender">${
                          member.gender === "male" ? "Nam" : "Nữ"
                        }</span>
                    </div>
                </div>
            </td>
            <td><span class="card-id">${member.cardId}</span></td>
            <td>${member.phone}</td>
            <td>${member.email}</td>
            <td>${member.packageName}</td>
            <td>${formatDate(member.endDate)}</td>
            <td><span class="status-badge ${status} ${statusBadgeClass}" ${statusBadgeClick}>${getStatusText(
    status
  )}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewMember(${
                      member.id
                    })" title="Xem chi tiết"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit" onclick="editMember(${
                      member.id
                    })" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>
                    <button class="action-btn renew" onclick="openRenewModal(${
                      member.id
                    })" title="Gia hạn"><i class="fas fa-sync"></i></button>
                    <button class="action-btn delete" onclick="deleteMember(${
                      member.id
                    })" title="Xóa"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `;
}

// ===== Search Handler =====
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase().trim();
  if (!searchTerm) {
    filterMembers();
    return;
  }

  const filtered = getFilteredMembers().filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm) ||
      m.email.toLowerCase().includes(searchTerm) ||
      m.phone.includes(searchTerm) ||
      m.cardId.toLowerCase().includes(searchTerm)
  );
  renderMembers(filtered);
}

// ===== Get Filtered Members =====
function getFilteredMembers() {
  const statusFilter = document.getElementById("filterStatus").value;
  const packageFilter = document.getElementById("filterPackage").value;

  let filtered = [...members];

  if (statusFilter !== "all") {
    filtered = filtered.filter(
      (m) => getMemberStatus(m.endDate) === statusFilter
    );
  }

  if (packageFilter !== "all") {
    filtered = filtered.filter((m) => m.packageId === parseInt(packageFilter));
  }

  return filtered;
}

// ===== Filter Members =====
function filterMembers() {
  const searchTerm = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  let filtered = getFilteredMembers();

  if (searchTerm) {
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(searchTerm) ||
        m.email.toLowerCase().includes(searchTerm) ||
        m.phone.includes(searchTerm) ||
        m.cardId.toLowerCase().includes(searchTerm)
    );
  }

  renderMembers(filtered);
}

// ===== Select All Toggle =====
function toggleSelectAll() {
  const selectAllCheckbox = document.getElementById("selectAll");
  const checkboxes = document.querySelectorAll(".member-checkbox");

  if (selectAllCheckbox.checked) {
    checkboxes.forEach((cb) => {
      cb.checked = true;
      const id = parseInt(cb.dataset.id);
      if (!selectedMembers.includes(id)) selectedMembers.push(id);
    });
  } else {
    checkboxes.forEach((cb) => (cb.checked = false));
    selectedMembers = [];
  }

  updateRowSelection();
}

// ===== Toggle Member Select =====
function toggleMemberSelect(id) {
  const index = selectedMembers.indexOf(id);
  if (index > -1) {
    selectedMembers.splice(index, 1);
  } else {
    selectedMembers.push(id);
  }
  updateSelectAllCheckbox();
  updateRowSelection();
}

// ===== Update Select All Checkbox =====
function updateSelectAllCheckbox() {
  const selectAllCheckbox = document.getElementById("selectAll");
  const checkboxes = document.querySelectorAll(".member-checkbox");
  const checkedCount = document.querySelectorAll(
    ".member-checkbox:checked"
  ).length;

  if (checkboxes.length === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  } else if (checkedCount === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  } else if (checkedCount === checkboxes.length) {
    selectAllCheckbox.checked = true;
    selectAllCheckbox.indeterminate = false;
  } else {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = true;
  }
}

// ===== Update Row Selection =====
function updateRowSelection() {
  document.querySelectorAll("#membersTableBody tr").forEach((row) => {
    const checkbox = row.querySelector(".member-checkbox");
    if (checkbox) {
      row.classList.toggle("selected", checkbox.checked);
    }
  });
}

// ===== Modal Functions =====
function openModal(modalId) {
  document.getElementById(modalId).classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
  document.body.style.overflow = "";

  if (modalId === "addMemberModal") {
    document.getElementById("addMemberForm").reset();
    document.getElementById("startDate").valueAsDate = new Date();
    document.getElementById("endDate").value = "";
    document.getElementById("totalAmount").value = "";
  }
}

// ===== Update End Date =====
function updateEndDate() {
  const packageSelect = document.getElementById("memberPackage");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const totalAmountInput = document.getElementById("totalAmount");

  const selectedOption = packageSelect.options[packageSelect.selectedIndex];
  const duration = parseInt(selectedOption.dataset.duration) || 0;
  const price = parseInt(selectedOption.dataset.price) || 0;

  if (startDateInput.value && duration > 0) {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);
    endDateInput.value = endDate.toISOString().split("T")[0];
  }

  totalAmountInput.value = price > 0 ? formatCurrency(price) : "";
}

// ===== Add Member =====
function addMember(event) {
  event.preventDefault();

  const name = document.getElementById("memberName").value.trim();
  const phone = document.getElementById("memberPhone").value.trim();
  const email = document.getElementById("memberEmail").value.trim();
  const gender = document.getElementById("memberGender").value;
  const packageSelect = document.getElementById("memberPackage");
  const packageId = parseInt(packageSelect.value);
  const packageName =
    packageSelect.options[packageSelect.selectedIndex].text.split(" - ")[0];
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (
    !name ||
    !phone ||
    !email ||
    !gender ||
    !packageId ||
    !startDate ||
    !endDate
  ) {
    showToast("Vui lòng điền đầy đủ thông tin!", "error");
    return;
  }

  // Validate phone
  if (!/^0\d{9}$/.test(phone)) {
    showToast("Số điện thoại không hợp lệ!", "error");
    return;
  }

  // Validate email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast("Email không hợp lệ!", "error");
    return;
  }

  if (members.some((m) => m.phone === phone)) {
    showToast("Số điện thoại đã tồn tại!", "error");
    return;
  }

  if (members.some((m) => m.email === email)) {
    showToast("Email đã tồn tại!", "error");
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
    createdAt: new Date().toISOString(),
  };

  members.push(newMember);
  saveMembers();

  closeModal("addMemberModal");
  renderMembers();
  updateSummary();

  showToast(`Đăng ký thành công! Mã thẻ: ${newMember.cardId}`, "success");
}

// ===== View Member =====
function viewMember(id) {
  const member = members.find((m) => m.id === id);
  if (!member) return;

  const status = getMemberStatus(member.endDate);
  const avatarBg = member.gender === "male" ? "3b82f6" : "ec4899";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    member.name
  )}&background=${avatarBg}&color=fff&size=100`;

  const daysLeft = Math.ceil(
    (new Date(member.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const daysText =
    daysLeft < 0
      ? `Hết hạn ${Math.abs(daysLeft)} ngày trước`
      : `Còn ${daysLeft} ngày`;

  const content = `
        <div class="member-detail">
            <div class="member-detail-header">
                <img src="${avatarUrl}" alt="${member.name}">
                <div>
                    <h3>${member.name}</h3>
                    <span class="status-badge ${status}">${getStatusText(
    status
  )}</span>
                </div>
            </div>
            <div class="member-detail-body">
                <div class="detail-row"><span>Mã thẻ:</span><strong>${
                  member.cardId
                }</strong></div>
                <div class="detail-row"><span>Giới tính:</span><strong>${
                  member.gender === "male" ? "Nam" : "Nữ"
                }</strong></div>
                <div class="detail-row"><span>Số điện thoại:</span><strong>${
                  member.phone
                }</strong></div>
                <div class="detail-row"><span>Email:</span><strong>${
                  member.email
                }</strong></div>
                <div class="detail-row"><span>Gói tập:</span><strong>${
                  member.packageName
                }</strong></div>
                <div class="detail-row"><span>Ngày bắt đầu:</span><strong>${formatDate(
                  member.startDate
                )}</strong></div>
                <div class="detail-row"><span>Ngày hết hạn:</span><strong>${formatDate(
                  member.endDate
                )}</strong></div>
                <div class="detail-row"><span>Thời hạn:</span><strong class="${status}">${daysText}</strong></div>
            </div>
        </div>
    `;

  showDetailModal("Chi tiết hội viên", content);
}

// ===== Show Detail Modal =====
function showDetailModal(title, content) {
  // Create modal if not exists
  let modal = document.getElementById("detailModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "detailModal";
    modal.innerHTML = `
            <div class="modal-overlay" onclick="closeModal('detailModal')"></div>
            <div class="modal-content modal-sm">
                <div class="modal-header">
                    <h2 id="detailModalTitle"></h2>
                    <button class="close-btn" onclick="closeModal('detailModal')"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body" id="detailModalBody"></div>
            </div>
        `;
    document.body.appendChild(modal);
  }

  document.getElementById(
    "detailModalTitle"
  ).innerHTML = `<i class="fas fa-user"></i> ${title}`;
  document.getElementById("detailModalBody").innerHTML = content;
  openModal("detailModal");
}

// ===== Edit Member =====
function editMember(id) {
  const member = members.find((m) => m.id === id);
  if (!member) return;

  document.getElementById("editMemberId").value = member.id;
  document.getElementById("editMemberName").value = member.name;
  document.getElementById("editMemberPhone").value = member.phone;
  document.getElementById("editMemberEmail").value = member.email;
  document.getElementById("editCardId").value = member.cardId;
  document.getElementById("editStartDate").value = member.startDate;
  document.getElementById("editEndDate").value = member.endDate;

  openModal("editMemberModal");
}

// ===== Update Member =====
function updateMember(event) {
  event.preventDefault();

  const id = parseInt(document.getElementById("editMemberId").value);
  const memberIndex = members.findIndex((m) => m.id === id);
  if (memberIndex === -1) return;

  const name = document.getElementById("editMemberName").value.trim();
  const phone = document.getElementById("editMemberPhone").value.trim();
  const email = document.getElementById("editMemberEmail").value.trim();
  const startDate = document.getElementById("editStartDate").value;
  const endDate = document.getElementById("editEndDate").value;

  if (members.some((m) => m.id !== id && m.phone === phone)) {
    showToast("Số điện thoại đã tồn tại!", "error");
    return;
  }

  if (members.some((m) => m.id !== id && m.email === email)) {
    showToast("Email đã tồn tại!", "error");
    return;
  }

  members[memberIndex] = {
    ...members[memberIndex],
    name,
    phone,
    email,
    startDate,
    endDate,
  };

  saveMembers();
  closeModal("editMemberModal");
  renderMembers();
  updateSummary();

  showToast("Cập nhật thành công!", "success");
}

// ===== Delete Member =====
function deleteMember(id) {
  const member = members.find((m) => m.id === id);
  if (!member) return;

  if (confirm(`Bạn có chắc muốn xóa hội viên "${member.name}"?`)) {
    members = members.filter((m) => m.id !== id);
    selectedMembers = selectedMembers.filter((sid) => sid !== id);
    saveMembers();
    renderMembers();
    updateSummary();
    showToast("Đã xóa hội viên!", "success");
  }
}

// ===== Delete Selected Members =====
function deleteSelectedMembers() {
  if (selectedMembers.length === 0) {
    showToast("Vui lòng chọn hội viên cần xóa!", "error");
    return;
  }

  if (
    confirm(`Bạn có chắc muốn xóa ${selectedMembers.length} hội viên đã chọn?`)
  ) {
    members = members.filter((m) => !selectedMembers.includes(m.id));
    selectedMembers = [];
    saveMembers();
    renderMembers();
    updateSummary();
    showToast("Đã xóa các hội viên đã chọn!", "success");
  }
}

// ===== Open Renew Modal =====
function openRenewModal(id) {
  const member = members.find((m) => m.id === id);
  if (!member) return;

  document.getElementById("renewMemberId").value = member.id;

  const avatarBg = member.gender === "male" ? "3b82f6" : "ec4899";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    member.name
  )}&background=${avatarBg}&color=fff`;
  document.getElementById("renewMemberInfo").innerHTML = `
        <img src="${avatarUrl}" alt="${member.name}">
        <div class="info">
            <h4>${member.name}</h4>
            <p>Mã thẻ: ${member.cardId} | Hết hạn: ${formatDate(
    member.endDate
  )}</p>
        </div>
    `;

  document.getElementById("renewPackage").value = "";
  openModal("renewModal");
}

// ===== Renew Membership =====
function renewMembership(event) {
  event.preventDefault();

  const id = parseInt(document.getElementById("renewMemberId").value);
  const memberIndex = members.findIndex((m) => m.id === id);
  if (memberIndex === -1) return;

  const packageSelect = document.getElementById("renewPackage");
  const selectedOption = packageSelect.options[packageSelect.selectedIndex];
  const duration = parseInt(selectedOption.dataset.duration);
  const packageName = selectedOption.text.split(" - ")[0];
  const packageId = parseInt(packageSelect.value);

  if (!packageId) {
    showToast("Vui lòng chọn gói gia hạn!", "error");
    return;
  }

  const currentEndDate = new Date(members[memberIndex].endDate);
  const today = new Date();
  const baseDate = currentEndDate > today ? currentEndDate : today;

  const newEndDate = new Date(baseDate);
  newEndDate.setDate(newEndDate.getDate() + duration);

  members[memberIndex] = {
    ...members[memberIndex],
    packageId,
    packageName,
    startDate: baseDate.toISOString().split("T")[0],
    endDate: newEndDate.toISOString().split("T")[0],
  };

  saveMembers();
  closeModal("renewModal");
  renderMembers();
  updateSummary();

  showToast(
    `Gia hạn thành công! Hạn mới: ${formatDate(newEndDate.toISOString())}`,
    "success"
  );
}

// ===== Export Members to Excel/CSV =====
function exportMembers() {
  const dataToExport =
    selectedMembers.length > 0
      ? members.filter((m) => selectedMembers.includes(m.id))
      : members;

  if (dataToExport.length === 0) {
    showToast("Không có dữ liệu để xuất!", "error");
    return;
  }

  // Create CSV content
  const headers = [
    "Mã thẻ",
    "Họ tên",
    "Giới tính",
    "Số điện thoại",
    "Email",
    "Gói tập",
    "Ngày bắt đầu",
    "Ngày hết hạn",
    "Trạng thái",
  ];
  const rows = dataToExport.map((m) => [
    m.cardId,
    m.name,
    m.gender === "male" ? "Nam" : "Nữ",
    m.phone,
    m.email,
    m.packageName,
    formatDate(m.startDate),
    formatDate(m.endDate),
    getStatusText(getMemberStatus(m.endDate)),
  ]);

  // Add BOM for UTF-8
  let csvContent = "\uFEFF";
  csvContent += headers.join(",") + "\n";
  csvContent += rows
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  // Download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `danh-sach-hoi-vien-${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`Đã xuất ${dataToExport.length} hội viên!`, "success");
}

// ===== Toast Notification =====
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  toast.className = "toast " + type;
  toastMessage.textContent = message;

  const icon = toast.querySelector("i");
  icon.className =
    type === "success" ? "fas fa-check-circle" : "fas fa-exclamation-circle";

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ===== Sorting =====
let currentSort = { column: null, direction: "asc" };

function sortMembers(column) {
  if (currentSort.column === column) {
    currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
  } else {
    currentSort.column = column;
    currentSort.direction = "asc";
  }

  const sorted = [...members].sort((a, b) => {
    let valA, valB;

    switch (column) {
      case "name":
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
        break;
      case "cardId":
        valA = a.cardId;
        valB = b.cardId;
        break;
      case "endDate":
        valA = new Date(a.endDate);
        valB = new Date(b.endDate);
        break;
      case "status":
        const statusOrder = { expired: 0, expiring: 1, active: 2 };
        valA = statusOrder[getMemberStatus(a.endDate)];
        valB = statusOrder[getMemberStatus(b.endDate)];
        break;
      default:
        valA = a[column];
        valB = b[column];
    }

    if (valA < valB) return currentSort.direction === "asc" ? -1 : 1;
    if (valA > valB) return currentSort.direction === "asc" ? 1 : -1;
    return 0;
  });

  renderMembers(sorted);
  updateSortIcons(column);
}

function updateSortIcons(activeColumn) {
  document.querySelectorAll(".sort-icon").forEach((icon) => {
    icon.className = "fas fa-sort sort-icon";
  });

  const activeIcon = document.querySelector(
    `[data-sort="${activeColumn}"] .sort-icon`
  );
  if (activeIcon) {
    activeIcon.className = `fas fa-sort-${
      currentSort.direction === "asc" ? "up" : "down"
    } sort-icon`;
  }
}

// ===== Pagination =====
let currentPage = 1;
let itemsPerPage = 10;

function renderMembersWithPagination(filteredList = null) {
  const displayMembers = filteredList || members;
  const totalPages = Math.ceil(displayMembers.length / itemsPerPage);

  if (currentPage > totalPages) currentPage = totalPages || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMembers = displayMembers.slice(startIndex, endIndex);

  const tbody = document.getElementById("membersTableBody");
  document.getElementById("showingCount").textContent = `${
    startIndex + 1
  }-${Math.min(endIndex, displayMembers.length)} / ${displayMembers.length}`;

  if (paginatedMembers.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="9">
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <h3>Không có hội viên</h3>
                        <p>Nhấn "Thêm hội viên" để đăng ký mới</p>
                    </div>
                </td>
            </tr>
        `;
    return;
  }

  tbody.innerHTML = paginatedMembers
    .map((member) => createMemberRow(member))
    .join("");
  updateSelectAllCheckbox();
  renderPagination(totalPages, displayMembers.length);
}

function renderPagination(totalPages, totalItems) {
  let paginationContainer = document.getElementById("paginationContainer");

  if (!paginationContainer) {
    const cardBody = document.querySelector(".card-body");
    paginationContainer = document.createElement("div");
    paginationContainer.id = "paginationContainer";
    paginationContainer.className = "pagination-container";
    cardBody.appendChild(paginationContainer);
  }

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let paginationHTML = '<div class="pagination">';

  // Previous button
  paginationHTML += `<button class="page-btn" ${
    currentPage === 1 ? "disabled" : ""
  } onclick="goToPage(${
    currentPage - 1
  })"><i class="fas fa-chevron-left"></i></button>`;

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      paginationHTML += `<button class="page-btn ${
        i === currentPage ? "active" : ""
      }" onclick="goToPage(${i})">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      paginationHTML += '<span class="page-dots">...</span>';
    }
  }

  // Next button
  paginationHTML += `<button class="page-btn" ${
    currentPage === totalPages ? "disabled" : ""
  } onclick="goToPage(${
    currentPage + 1
  })"><i class="fas fa-chevron-right"></i></button>`;

  paginationHTML += "</div>";

  // Items per page selector
  paginationHTML += `
        <div class="page-size-selector">
            <span>Hiển thị:</span>
            <select onchange="changePageSize(this.value)">
                <option value="5" ${
                  itemsPerPage === 5 ? "selected" : ""
                }>5</option>
                <option value="10" ${
                  itemsPerPage === 10 ? "selected" : ""
                }>10</option>
                <option value="20" ${
                  itemsPerPage === 20 ? "selected" : ""
                }>20</option>
                <option value="50" ${
                  itemsPerPage === 50 ? "selected" : ""
                }>50</option>
            </select>
        </div>
    `;

  paginationContainer.innerHTML = paginationHTML;
}

function goToPage(page) {
  currentPage = page;
  filterMembers();
}

function changePageSize(size) {
  itemsPerPage = parseInt(size);
  currentPage = 1;
  filterMembers();
}

// ===== Bulk Actions =====
function showBulkActions() {
  let bulkBar = document.getElementById("bulkActionsBar");

  if (!bulkBar) {
    bulkBar = document.createElement("div");
    bulkBar.id = "bulkActionsBar";
    bulkBar.className = "bulk-actions-bar";
    bulkBar.innerHTML = `
            <div class="bulk-info">
                <span id="selectedCount">0</span> hội viên đã chọn
            </div>
            <div class="bulk-buttons">
                <button class="btn btn-secondary btn-sm" onclick="clearSelection()">
                    <i class="fas fa-times"></i> Bỏ chọn
                </button>
                <button class="btn btn-warning btn-sm" onclick="bulkRenew()">
                    <i class="fas fa-sync"></i> Gia hạn
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteSelectedMembers()">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </div>
        `;
    document
      .querySelector(".content")
      .insertBefore(bulkBar, document.querySelector(".card"));
  }

  document.getElementById("selectedCount").textContent = selectedMembers.length;
  bulkBar.classList.toggle("show", selectedMembers.length > 0);
}

function clearSelection() {
  selectedMembers = [];
  document
    .querySelectorAll(".member-checkbox")
    .forEach((cb) => (cb.checked = false));
  document.getElementById("selectAll").checked = false;
  document.getElementById("selectAll").indeterminate = false;
  updateRowSelection();
  showBulkActions();
}

// ===== Bulk Renew =====
function bulkRenew() {
  if (selectedMembers.length === 0) {
    showToast("Vui lòng chọn hội viên cần gia hạn!", "error");
    return;
  }

  // Create bulk renew modal
  let modal = document.getElementById("bulkRenewModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "bulkRenewModal";
    modal.innerHTML = `
            <div class="modal-overlay" onclick="closeModal('bulkRenewModal')"></div>
            <div class="modal-content modal-sm">
                <div class="modal-header">
                    <h2><i class="fas fa-sync"></i> Gia hạn hàng loạt</h2>
                    <button class="close-btn" onclick="closeModal('bulkRenewModal')"><i class="fas fa-times"></i></button>
                </div>
                <form onsubmit="processBulkRenew(event)">
                    <div class="modal-body">
                        <p class="bulk-renew-info">Gia hạn cho <strong id="bulkRenewCount">0</strong> hội viên đã chọn</p>
                        <div class="form-group">
                            <label>Chọn gói gia hạn</label>
                            <select id="bulkRenewPackage" required>
                                <option value="">Chọn gói tập</option>
                                <option value="1" data-duration="30">Gói 1 tháng - 500,000đ</option>
                                <option value="2" data-duration="90">Gói 3 tháng - 1,200,000đ</option>
                                <option value="3" data-duration="180">Gói 6 tháng - 2,000,000đ</option>
                                <option value="4" data-duration="365">Gói 12 tháng - 3,500,000đ</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('bulkRenewModal')">Hủy</button>
                        <button type="submit" class="btn btn-primary"><i class="fas fa-check"></i> Gia hạn tất cả</button>
                    </div>
                </form>
            </div>
        `;
    document.body.appendChild(modal);
  }

  document.getElementById("bulkRenewCount").textContent =
    selectedMembers.length;
  openModal("bulkRenewModal");
}

function processBulkRenew(event) {
  event.preventDefault();

  const packageSelect = document.getElementById("bulkRenewPackage");
  const selectedOption = packageSelect.options[packageSelect.selectedIndex];
  const duration = parseInt(selectedOption.dataset.duration);
  const packageName = selectedOption.text.split(" - ")[0];
  const packageId = parseInt(packageSelect.value);

  if (!packageId) {
    showToast("Vui lòng chọn gói gia hạn!", "error");
    return;
  }

  let renewedCount = 0;

  selectedMembers.forEach((memberId) => {
    const memberIndex = members.findIndex((m) => m.id === memberId);
    if (memberIndex !== -1) {
      const currentEndDate = new Date(members[memberIndex].endDate);
      const today = new Date();
      const baseDate = currentEndDate > today ? currentEndDate : today;

      const newEndDate = new Date(baseDate);
      newEndDate.setDate(newEndDate.getDate() + duration);

      members[memberIndex] = {
        ...members[memberIndex],
        packageId,
        packageName,
        startDate: baseDate.toISOString().split("T")[0],
        endDate: newEndDate.toISOString().split("T")[0],
      };
      renewedCount++;
    }
  });

  saveMembers();
  closeModal("bulkRenewModal");
  clearSelection();
  renderMembers();
  updateSummary();

  showToast(`Đã gia hạn thành công ${renewedCount} hội viên!`, "success");
}

// Override toggleMemberSelect to show bulk actions
const originalToggleMemberSelect = toggleMemberSelect;
toggleMemberSelect = function (id) {
  originalToggleMemberSelect(id);
  showBulkActions();
};

// Override toggleSelectAll to show bulk actions
const originalToggleSelectAll = toggleSelectAll;
toggleSelectAll = function () {
  originalToggleSelectAll();
  showBulkActions();
};

// ===== Print Members List =====
function printMembers() {
  const dataToExport =
    selectedMembers.length > 0
      ? members.filter((m) => selectedMembers.includes(m.id))
      : members;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Danh sách hội viên - FitZone Gym</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { text-align: center; color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background: #6366f1; color: white; }
                tr:nth-child(even) { background: #f9f9f9; }
                .status-active { color: #10b981; }
                .status-expiring { color: #f59e0b; }
                .status-expired { color: #ef4444; }
                .print-date { text-align: right; color: #666; margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <h1>DANH SÁCH HỘI VIÊN - FITZONE GYM</h1>
            <p class="print-date">Ngày in: ${new Date().toLocaleDateString(
              "vi-VN"
            )}</p>
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã thẻ</th>
                        <th>Họ tên</th>
                        <th>SĐT</th>
                        <th>Email</th>
                        <th>Gói tập</th>
                        <th>Ngày hết hạn</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    ${dataToExport
                      .map((m, i) => {
                        const status = getMemberStatus(m.endDate);
                        return `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${m.cardId}</td>
                                <td>${m.name}</td>
                                <td>${m.phone}</td>
                                <td>${m.email}</td>
                                <td>${m.packageName}</td>
                                <td>${formatDate(m.endDate)}</td>
                                <td class="status-${status}">${getStatusText(
                          status
                        )}</td>
                            </tr>
                        `;
                      })
                      .join("")}
                </tbody>
            </table>
            <script>window.print();</script>
        </body>
        </html>
    `);
  printWindow.document.close();
}
