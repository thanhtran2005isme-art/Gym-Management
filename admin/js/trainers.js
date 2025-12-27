// ===== Data Storage =====
let trainers = JSON.parse(localStorage.getItem("gymTrainers")) || [];

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

// ===== Specialty Labels =====
const specialtyLabels = {
  fitness: "Fitness",
  yoga: "Yoga",
  boxing: "Boxing",
  cardio: "Cardio",
  strength: "Strength Training",
};

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", function () {
  const user = checkAuth();
  if (!user) return;

  if (trainers.length === 0) loadSampleTrainers();

  initTheme();
  initSidebar();
  initUserInfo(user);
  initMenuByRole(user.role);

  renderTrainers();
  updateSummary();
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
    themeIcon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
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
  document.querySelector(".admin-dropdown").classList.toggle("active");
}

// ===== Fullscreen =====
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// ===== Sidebar =====
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
  document
    .getElementById("themeToggle")
    ?.addEventListener("click", toggleTheme);
  document
    .getElementById("fullscreenBtn")
    ?.addEventListener("click", toggleFullscreen);
  document
    .getElementById("sidebarCollapseBtn")
    ?.addEventListener("click", toggleSidebar);
  document
    .getElementById("menuToggle")
    ?.addEventListener("click", toggleMobileSidebar);
  document
    .getElementById("searchInput")
    ?.addEventListener("input", handleSearch);

  document.addEventListener("click", function (e) {
    const dropdown = document.querySelector(".admin-dropdown");
    if (dropdown && !dropdown.contains(e.target))
      dropdown.classList.remove("active");
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document
        .querySelectorAll(".modal.active")
        .forEach((modal) => closeModal(modal.id));
    }
  });
}

// ===== Sample Trainers Data =====
function loadSampleTrainers() {
  const sampleTrainers = [
    {
      id: 1,
      name: "Trần Văn Hùng",
      phone: "0901234567",
      email: "hung.tran@fitzone.com",
      gender: "male",
      specialty: "fitness",
      experience: 5,
      bio: "Chuyên gia fitness với 5 năm kinh nghiệm, từng đào tạo nhiều vận động viên chuyên nghiệp.",
      rating: 4.8,
      clients: 25,
      status: "active",
      createdAt: "2023-01-15",
    },
    {
      id: 2,
      name: "Nguyễn Thị Mai",
      phone: "0912345678",
      email: "mai.nguyen@fitzone.com",
      gender: "female",
      specialty: "yoga",
      experience: 7,
      bio: "Giảng viên Yoga quốc tế, chứng chỉ RYT-500.",
      rating: 4.9,
      clients: 30,
      status: "active",
      createdAt: "2022-06-20",
    },
    {
      id: 3,
      name: "Lê Minh Tuấn",
      phone: "0923456789",
      email: "tuan.le@fitzone.com",
      gender: "male",
      specialty: "boxing",
      experience: 8,
      bio: "Cựu võ sĩ boxing chuyên nghiệp, HLV đội tuyển quốc gia.",
      rating: 4.7,
      clients: 18,
      status: "active",
      createdAt: "2021-03-10",
    },
    {
      id: 4,
      name: "Phạm Thị Lan",
      phone: "0934567890",
      email: "lan.pham@fitzone.com",
      gender: "female",
      specialty: "cardio",
      experience: 4,
      bio: "Chuyên gia cardio và giảm cân, đã giúp hơn 100 học viên đạt mục tiêu.",
      rating: 4.6,
      clients: 22,
      status: "active",
      createdAt: "2023-05-01",
    },
    {
      id: 5,
      name: "Hoàng Văn Nam",
      phone: "0945678901",
      email: "nam.hoang@fitzone.com",
      gender: "male",
      specialty: "strength",
      experience: 6,
      bio: "HLV strength training, chuyên về tăng cơ và sức mạnh.",
      rating: 4.5,
      clients: 15,
      status: "inactive",
      createdAt: "2022-09-15",
    },
    {
      id: 6,
      name: "Vũ Thị Hương",
      phone: "0956789012",
      email: "huong.vu@fitzone.com",
      gender: "female",
      specialty: "yoga",
      experience: 3,
      bio: "Giảng viên Yoga trẻ đầy nhiệt huyết, chuyên về Yoga trị liệu.",
      rating: 4.4,
      clients: 12,
      status: "active",
      createdAt: "2024-01-10",
    },
  ];
  trainers = sampleTrainers;
  saveTrainers();
}

// ===== Save to LocalStorage =====
function saveTrainers() {
  localStorage.setItem("gymTrainers", JSON.stringify(trainers));
}

// ===== Update Summary =====
function updateSummary() {
  const total = trainers.length;
  const active = trainers.filter((t) => t.status === "active").length;
  const totalClients = trainers.reduce((sum, t) => sum + t.clients, 0);
  const avgRating =
    trainers.length > 0
      ? (
          trainers.reduce((sum, t) => sum + t.rating, 0) / trainers.length
        ).toFixed(1)
      : 0;

  document.getElementById("totalTrainers").textContent = total;
  document.getElementById("activeTrainers").textContent = active;
  document.getElementById("totalClients").textContent = totalClients;
  document.getElementById("avgRating").textContent = avgRating;
}

// ===== Render Trainers =====
function renderTrainers(filteredList = null) {
  const grid = document.getElementById("trainersGrid");
  const displayTrainers = filteredList || trainers;

  if (displayTrainers.length === 0) {
    grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-ninja"></i>
                <h3>Chưa có huấn luyện viên</h3>
                <p>Nhấn "Thêm PT" để thêm huấn luyện viên mới</p>
            </div>
        `;
    return;
  }

  grid.innerHTML = displayTrainers
    .map((trainer) => createTrainerCard(trainer))
    .join("");
}

// ===== Create Trainer Card =====
function createTrainerCard(trainer) {
  const avatarBg = trainer.gender === "male" ? "3b82f6" : "ec4899";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    trainer.name
  )}&background=${avatarBg}&color=fff&size=80`;
  const stars = renderStars(trainer.rating);

  return `
        <div class="trainer-card ${
          trainer.status === "inactive" ? "inactive" : ""
        }">
            <div class="trainer-header">
                <span class="trainer-status ${trainer.status}">${
    trainer.status === "active" ? "Đang làm việc" : "Nghỉ phép"
  }</span>
                <img src="${avatarUrl}" alt="${
    trainer.name
  }" class="trainer-avatar">
                <h3 class="trainer-name">${trainer.name}</h3>
                <span class="trainer-specialty">${
                  specialtyLabels[trainer.specialty] || trainer.specialty
                }</span>
            </div>
            <div class="trainer-body">
                <div class="trainer-info">
                    <div class="info-item"><i class="fas fa-phone"></i> ${
                      trainer.phone
                    }</div>
                    <div class="info-item"><i class="fas fa-envelope"></i> ${
                      trainer.email
                    }</div>
                    <div class="info-item"><i class="fas fa-briefcase"></i> ${
                      trainer.experience
                    } năm kinh nghiệm</div>
                </div>
                ${
                  trainer.bio ? `<p class="trainer-bio">${trainer.bio}</p>` : ""
                }
                <div class="trainer-stats">
                    <div class="stat-item">
                        <div class="stat-number">${trainer.clients}</div>
                        <div class="stat-label">Học viên</div>
                    </div>
                    <div class="stat-item">
                        <div class="rating">${stars}<span class="rating-value">${
    trainer.rating
  }</span></div>
                        <div class="stat-label">Đánh giá</div>
                    </div>
                </div>
            </div>
            <div class="trainer-actions">
                <button class="btn btn-secondary btn-sm" onclick="editTrainer(${
                  trainer.id
                })"><i class="fas fa-edit"></i> Sửa</button>
                <button class="btn btn-${
                  trainer.status === "active" ? "warning" : "success"
                } btn-sm" onclick="toggleTrainerStatus(${trainer.id})">
                    <i class="fas fa-${
                      trainer.status === "active" ? "pause" : "play"
                    }"></i> ${
    trainer.status === "active" ? "Nghỉ phép" : "Làm việc"
  }
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteTrainer(${
                  trainer.id
                })"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;
}

// ===== Render Stars =====
function renderStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += `<i class="fas fa-star ${
      i <= Math.round(rating) ? "" : "empty"
    }"></i>`;
  }
  return stars;
}

// ===== Search Handler =====
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase().trim();
  if (!searchTerm) {
    filterTrainers();
    return;
  }

  const filtered = getFilteredTrainers().filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm) ||
      t.email.toLowerCase().includes(searchTerm) ||
      t.phone.includes(searchTerm)
  );
  renderTrainers(filtered);
}

// ===== Get Filtered Trainers =====
function getFilteredTrainers() {
  const specialtyFilter = document.getElementById("filterSpecialty").value;
  const statusFilter = document.getElementById("filterStatus").value;

  let filtered = [...trainers];
  if (specialtyFilter !== "all")
    filtered = filtered.filter((t) => t.specialty === specialtyFilter);
  if (statusFilter !== "all")
    filtered = filtered.filter((t) => t.status === statusFilter);
  return filtered;
}

// ===== Filter Trainers =====
function filterTrainers() {
  const searchTerm = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  let filtered = getFilteredTrainers();

  if (searchTerm) {
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(searchTerm) ||
        t.email.toLowerCase().includes(searchTerm) ||
        t.phone.includes(searchTerm)
    );
  }
  renderTrainers(filtered);
}
