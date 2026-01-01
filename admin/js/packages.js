// ===== Data Storage =====
let packages = JSON.parse(localStorage.getItem("gymPackages")) || [];
let members = JSON.parse(localStorage.getItem("gymMembers")) || [];

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

  // Load sample data if empty
  if (packages.length === 0) loadSamplePackages();

  // Initialize UI
  initTheme();
  initSidebar();
  initUserInfo(user);
  initMenuByRole(user.role);

  // Render data
  renderPackages();
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

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    const dropdown = document.querySelector(".admin-dropdown");
    if (dropdown && !dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document
        .querySelectorAll(".modal.active")
        .forEach((modal) => closeModal(modal.id));
    }
  });
}

// ===== Sample Packages Data =====
function loadSamplePackages() {
  const samplePackages = [
    {
      id: 1,
      name: "Gói 1 tháng",
      duration: 30,
      price: 500000,
      description: "Gói tập cơ bản phù hợp cho người mới bắt đầu",
      features: ["Tập không giới hạn", "Sử dụng máy tập", "Phòng thay đồ"],
      color: "blue",
      status: "active",
      isPopular: false,
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      name: "Gói 3 tháng",
      duration: 90,
      price: 1200000,
      description: "Gói tập tiết kiệm, phù hợp cho người tập thường xuyên",
      features: [
        "Tập không giới hạn",
        "Sử dụng máy tập",
        "Phòng thay đồ",
        "Tủ đồ cá nhân",
        "1 buổi PT miễn phí",
      ],
      color: "green",
      status: "active",
      isPopular: true,
      createdAt: "2024-01-01",
    },
    {
      id: 3,
      name: "Gói 6 tháng",
      duration: 180,
      price: 2000000,
      description: "Gói tập cao cấp với nhiều ưu đãi hấp dẫn",
      features: [
        "Tập không giới hạn",
        "Sử dụng máy tập",
        "Phòng xông hơi",
        "Tủ đồ cá nhân",
        "3 buổi PT miễn phí",
        "Nước uống miễn phí",
      ],
      color: "purple",
      status: "active",
      isPopular: false,
      createdAt: "2024-01-01",
    },
    {
      id: 4,
      name: "Gói 12 tháng",
      duration: 365,
      price: 3500000,
      description: "Gói VIP trọn năm với đầy đủ tiện ích cao cấp",
      features: [
        "Tập không giới hạn",
        "Sử dụng máy tập",
        "Phòng xông hơi",
        "Tủ đồ VIP",
        "5 buổi PT miễn phí",
        "Nước uống miễn phí",
        "Khăn tập miễn phí",
        "Ưu tiên đặt lịch",
      ],
      color: "gold",
      status: "active",
      isPopular: false,
      createdAt: "2024-01-01",
    },
  ];
  packages = samplePackages;
  savePackages();
}

// ===== Save to LocalStorage =====
function savePackages() {
  localStorage.setItem("gymPackages", JSON.stringify(packages));
}

// ===== Format Currency =====
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

// ===== Update Summary =====
function updateSummary() {
  const total = packages.length;
  const active = packages.filter((p) => p.status === "active").length;

  // Calculate total revenue from members
  let totalRevenue = 0;
  members.forEach((m) => {
    const pkg = packages.find((p) => p.id === m.packageId);
    if (pkg) totalRevenue += pkg.price;
  });

  document.getElementById("totalPackages").textContent = total;
  document.getElementById("activePackages").textContent = active;
  document.getElementById("totalRevenue").textContent = (
    totalRevenue / 1000000
  ).toFixed(1);
  document.getElementById("totalMembers").textContent = members.length;
}

// ===== Get Members Count by Package =====
function getMembersCount(packageId) {
  return members.filter((m) => m.packageId === packageId).length;
}

// ===== Render Packages =====
function renderPackages() {
  const grid = document.getElementById("packagesGrid");

  if (packages.length === 0) {
    grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>Chưa có gói tập nào</h3>
                <p>Nhấn "Thêm gói tập" để tạo gói tập mới</p>
                <button class="btn btn-primary" onclick="openModal('addPackageModal')">
                    <i class="fas fa-plus"></i> Thêm gói tập
                </button>
            </div>
        `;
    return;
  }

  grid.innerHTML = packages.map((pkg) => createPackageCard(pkg)).join("");
}

// ===== Create Package Card =====
function createPackageCard(pkg) {
  const membersCount = getMembersCount(pkg.id);
  const pricePerDay = Math.round(pkg.price / pkg.duration);
  const revenue = membersCount * pkg.price;

  const featuresHTML = pkg.features
    .slice(0, 5)
    .map((f) => `<li><i class="fas fa-check"></i> ${f}</li>`)
    .join("");

  const moreFeatures =
    pkg.features.length > 5
      ? `<li><i class="fas fa-plus"></i> +${
          pkg.features.length - 5
        } quyền lợi khác</li>`
      : "";

  return `
        <div class="package-card ${
          pkg.status === "inactive" ? "inactive" : ""
        }">
            <div class="package-header ${pkg.color}">
                ${
                  pkg.isPopular
                    ? '<span class="popular-badge"><i class="fas fa-star"></i> Phổ biến</span>'
                    : ""
                }
                <div class="package-icon">
                    <i class="fas fa-${getPackageIcon(pkg.duration)}"></i>
                </div>
                <h3 class="package-name">${pkg.name}</h3>
                <div class="package-duration">
                    <i class="fas fa-clock"></i> ${pkg.duration} ngày
                </div>
            </div>
            
            <div class="package-price">
                <div class="price-value">${formatCurrency(pkg.price)}</div>
                <div class="price-per-day">~ ${formatCurrency(
                  pricePerDay
                )}/ngày</div>
            </div>
            
            ${
              pkg.description
                ? `<p class="package-description">${pkg.description}</p>`
                : ""
            }
            
            <div class="package-features">
                <h4>Quyền lợi</h4>
                <ul class="feature-list">
                    ${featuresHTML}
                    ${moreFeatures}
                </ul>
            </div>
            
            <div class="package-stats">
                <div class="stat-item">
                    <div class="stat-number">${membersCount}</div>
                    <div class="stat-label">Hội viên</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${(revenue / 1000000).toFixed(
                      1
                    )}M</div>
                    <div class="stat-label">Doanh thu</div>
                </div>
            </div>
            
            <div class="package-actions">
                <button class="btn btn-secondary btn-sm" onclick="editPackage(${
                  pkg.id
                })">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                <button class="btn btn-${
                  pkg.status === "active" ? "warning" : "success"
                } btn-sm" onclick="togglePackageStatus(${pkg.id})">
                    <i class="fas fa-${
                      pkg.status === "active" ? "pause" : "play"
                    }"></i> 
                    ${pkg.status === "active" ? "Tạm ngưng" : "Kích hoạt"}
                </button>
                <button class="btn btn-danger btn-sm" onclick="deletePackage(${
                  pkg.id
                })">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

// ===== Get Package Icon =====
function getPackageIcon(duration) {
  if (duration <= 30) return "box";
  if (duration <= 90) return "boxes-stacked";
  if (duration <= 180) return "gem";
  return "crown";
}

// ===== Modal Functions =====
function openModal(modalId) {
  document.getElementById(modalId).classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
  document.body.style.overflow = "";

  if (modalId === "addPackageModal") {
    document.getElementById("addPackageForm").reset();
  }
}

// ===== Add Package =====
function addPackage(event) {
  event.preventDefault();

  const name = document.getElementById("packageName").value.trim();
  const duration = parseInt(document.getElementById("packageDuration").value);
  const price = parseInt(document.getElementById("packagePrice").value);
  const description = document
    .getElementById("packageDescription")
    .value.trim();
  const featuresText = document.getElementById("packageFeatures").value.trim();
  const color = document.getElementById("packageColor").value;
  const status = document.getElementById("packageStatus").value;

  if (!name || !duration || !price) {
    showToast("Vui lòng điền đầy đủ thông tin!", "error");
    return;
  }

  // Check duplicate name
  if (packages.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
    showToast("Tên gói tập đã tồn tại!", "error");
    return;
  }

  const features = featuresText
    ? featuresText.split("\n").filter((f) => f.trim())
    : [];

  const newPackage = {
    id: Date.now(),
    name,
    duration,
    price,
    description,
    features,
    color,
    status,
    isPopular: false,
    createdAt: new Date().toISOString(),
  };

  packages.push(newPackage);
  savePackages();

  closeModal("addPackageModal");
  renderPackages();
  updateSummary();

  showToast("Thêm gói tập thành công!", "success");
}

// ===== Edit Package =====
function editPackage(id) {
  const pkg = packages.find((p) => p.id === id);
  if (!pkg) return;

  document.getElementById("editPackageId").value = pkg.id;
  document.getElementById("editPackageName").value = pkg.name;
  document.getElementById("editPackageDuration").value = pkg.duration;
  document.getElementById("editPackagePrice").value = pkg.price;
  document.getElementById("editPackageDescription").value =
    pkg.description || "";
  document.getElementById("editPackageFeatures").value =
    pkg.features.join("\n");
  document.getElementById("editPackageColor").value = pkg.color;
  document.getElementById("editPackageStatus").value = pkg.status;

  openModal("editPackageModal");
}

// ===== Update Package =====
function updatePackage(event) {
  event.preventDefault();

  const id = parseInt(document.getElementById("editPackageId").value);
  const pkgIndex = packages.findIndex((p) => p.id === id);
  if (pkgIndex === -1) return;

  const name = document.getElementById("editPackageName").value.trim();
  const duration = parseInt(
    document.getElementById("editPackageDuration").value
  );
  const price = parseInt(document.getElementById("editPackagePrice").value);
  const description = document
    .getElementById("editPackageDescription")
    .value.trim();
  const featuresText = document
    .getElementById("editPackageFeatures")
    .value.trim();
  const color = document.getElementById("editPackageColor").value;
  const status = document.getElementById("editPackageStatus").value;

  // Check duplicate name (exclude current)
  if (
    packages.some(
      (p) => p.id !== id && p.name.toLowerCase() === name.toLowerCase()
    )
  ) {
    showToast("Tên gói tập đã tồn tại!", "error");
    return;
  }

  const features = featuresText
    ? featuresText.split("\n").filter((f) => f.trim())
    : [];

  packages[pkgIndex] = {
    ...packages[pkgIndex],
    name,
    duration,
    price,
    description,
    features,
    color,
    status,
  };

  savePackages();
  closeModal("editPackageModal");
  renderPackages();
  updateSummary();

  showToast("Cập nhật gói tập thành công!", "success");
}

// ===== Toggle Package Status =====
function togglePackageStatus(id) {
  const pkgIndex = packages.findIndex((p) => p.id === id);
  if (pkgIndex === -1) return;

  const newStatus =
    packages[pkgIndex].status === "active" ? "inactive" : "active";
  packages[pkgIndex].status = newStatus;

  savePackages();
  renderPackages();
  updateSummary();

  showToast(
    `Đã ${newStatus === "active" ? "kích hoạt" : "tạm ngưng"} gói tập!`,
    "success"
  );
}

// ===== Delete Package =====
function deletePackage(id) {
  const pkg = packages.find((p) => p.id === id);
  if (!pkg) return;

  const membersCount = getMembersCount(id);

  if (membersCount > 0) {
    showToast(
      `Không thể xóa! Có ${membersCount} hội viên đang sử dụng gói này.`,
      "error"
    );
    return;
  }

  if (confirm(`Bạn có chắc muốn xóa gói tập "${pkg.name}"?`)) {
    packages = packages.filter((p) => p.id !== id);
    savePackages();
    renderPackages();
    updateSummary();
    showToast("Đã xóa gói tập!", "success");
  }
}

// ===== Toggle Popular =====
function togglePopular(id) {
  const pkgIndex = packages.findIndex((p) => p.id === id);
  if (pkgIndex === -1) return;

  packages[pkgIndex].isPopular = !packages[pkgIndex].isPopular;

  savePackages();
  renderPackages();

  showToast(
    packages[pkgIndex].isPopular
      ? "Đã đánh dấu phổ biến!"
      : "Đã bỏ đánh dấu phổ biến!",
    "success"
  );
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
