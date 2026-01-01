// ===== Equipment Data =====
let equipment = JSON.parse(localStorage.getItem("gymEquipment")) || [];
let currentEquipmentId = null;
let currentFilter = "all";

// Rooms data
const rooms = [
  { id: "room1", name: "Phòng 1 - Yoga", icon: "fa-spa" },
  { id: "room2", name: "Phòng 2 - Gym", icon: "fa-dumbbell" },
  { id: "room3", name: "Phòng 3 - Cardio", icon: "fa-heartbeat" },
  { id: "room4", name: "Phòng 4 - Boxing", icon: "fa-fist-raised" },
  { id: "room5", name: "Phòng 5 - Dance", icon: "fa-music" },
];

// Category icons
const categoryIcons = {
  cardio: "fa-heartbeat",
  strength: "fa-dumbbell",
  "free-weight": "fa-weight-hanging",
  accessories: "fa-box",
};

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", function () {
  if (!checkAuth()) return;

  if (equipment.length === 0) {
    loadSampleEquipment();
  }

  initTheme();
  initSidebar();
  initEventListeners();
  renderEquipment();
  renderRooms();
  updateStats();
});

// ===== Auth =====
function checkAuth() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// ===== Theme =====
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById("themeIcon");
  if (icon) {
    icon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const newTheme = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
}

// ===== Sidebar =====
function initSidebar() {
  const saved = localStorage.getItem("sidebarCollapsed");
  if (saved === "true") {
    document.getElementById("sidebar").classList.add("collapsed");
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
  localStorage.setItem(
    "sidebarCollapsed",
    sidebar.classList.contains("collapsed")
  );
}

// ===== Event Listeners =====
function initEventListeners() {
  document
    .getElementById("themeToggle")
    ?.addEventListener("click", toggleTheme);
  document
    .getElementById("sidebarCollapseBtn")
    ?.addEventListener("click", toggleSidebar);
  document.getElementById("menuToggle")?.addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("active");
  });
  document
    .getElementById("fullscreenBtn")
    ?.addEventListener("click", toggleFullscreen);
  document
    .getElementById("searchInput")
    ?.addEventListener("input", handleSearch);

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "k") {
      e.preventDefault();
      document.getElementById("searchInput")?.focus();
    }
    if (e.key === "Escape") {
      document
        .querySelectorAll(".modal.active")
        .forEach((m) => closeModal(m.id));
    }
  });
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// ===== Render Equipment =====
function renderEquipment(filter = currentFilter) {
  const container = document.getElementById("equipmentGrid");
  let filtered = [...equipment];

  if (filter !== "all") {
    filtered = equipment.filter((e) => e.category === filter);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-equipment">
        <i class="fas fa-dumbbell"></i>
        <h3>Chưa có thiết bị</h3>
        <p>Nhấn "Thêm thiết bị" để thêm mới</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered
    .map((item) => createEquipmentCard(item))
    .join("");
}

function createEquipmentCard(item) {
  const icon = categoryIcons[item.category] || "fa-box";
  const statusText = getStatusText(item.status);
  const room = rooms.find((r) => r.id === item.room);

  return `
    <div class="equipment-card" onclick="viewEquipment(${item.id})">
      <div class="equipment-card-header">
        <div class="equipment-icon ${item.category}">
          <i class="fas ${icon}"></i>
        </div>
        <div class="equipment-info">
          <h3>${item.name}</h3>
          <span class="code">${item.code}</span>
        </div>
        <span class="equipment-status ${item.status}">${statusText}</span>
      </div>
      <div class="equipment-card-body">
        <div class="equipment-meta">
          <div class="meta-item">
            <i class="fas fa-door-open"></i>
            <span>${room?.name || "N/A"}</span>
          </div>
          <div class="meta-item">
            <i class="fas fa-industry"></i>
            <span>${item.brand || "Không rõ"}</span>
          </div>
          ${
            item.purchaseDate
              ? `
          <div class="meta-item">
            <i class="fas fa-calendar"></i>
            <span>Mua: ${formatDate(item.purchaseDate)}</span>
          </div>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `;
}

// ===== Render Rooms =====
function renderRooms() {
  const container = document.getElementById("roomsGrid");

  container.innerHTML = rooms
    .map((room) => {
      const roomEquipment = equipment.filter((e) => e.room === room.id);
      const activeCount = roomEquipment.filter(
        (e) => e.status === "active"
      ).length;
      const maintenanceCount = roomEquipment.filter(
        (e) => e.status === "maintenance"
      ).length;

      return `
      <div class="room-card">
        <div class="room-card-header">
          <h4><i class="fas ${room.icon}"></i> ${room.name}</h4>
          <span class="room-equipment-count">${roomEquipment.length} thiết bị</span>
        </div>
        <div class="room-stats">
          <div class="room-stat active">
            <i class="fas fa-circle"></i>
            <span>${activeCount} hoạt động</span>
          </div>
          <div class="room-stat maintenance">
            <i class="fas fa-circle"></i>
            <span>${maintenanceCount} bảo trì</span>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

// ===== Filter =====
function filterByCategory(category) {
  currentFilter = category;

  // Update active tab
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.filter === category);
  });

  renderEquipment(category);
}

// ===== Search =====
function handleSearch(e) {
  const term = e.target.value.toLowerCase().trim();

  if (!term) {
    renderEquipment(currentFilter);
    return;
  }

  const filtered = equipment.filter(
    (e) =>
      e.name.toLowerCase().includes(term) ||
      e.code.toLowerCase().includes(term) ||
      (e.brand && e.brand.toLowerCase().includes(term))
  );

  const container = document.getElementById("equipmentGrid");

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-equipment">
        <i class="fas fa-search"></i>
        <h3>Không tìm thấy kết quả</h3>
        <p>Thử tìm kiếm với từ khóa khác</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered
    .map((item) => createEquipmentCard(item))
    .join("");
}

// ===== Update Stats =====
function updateStats() {
  document.getElementById("totalEquipment").textContent = equipment.length;
  document.getElementById("activeEquipment").textContent = equipment.filter(
    (e) => e.status === "active"
  ).length;
  document.getElementById("maintenanceEquipment").textContent =
    equipment.filter((e) => e.status === "maintenance").length;
  document.getElementById("totalRooms").textContent = rooms.length;
}

// ===== Modal Functions =====
function openModal(modalId) {
  document.getElementById(modalId).classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
  document.body.style.overflow = "";

  if (modalId === "addEquipmentModal") {
    document.getElementById("addEquipmentForm").reset();
  }
}

// ===== Add Equipment =====
function addEquipment(event) {
  event.preventDefault();

  const name = document.getElementById("equipmentName").value.trim();
  const code = document
    .getElementById("equipmentCode")
    .value.trim()
    .toUpperCase();
  const category = document.getElementById("equipmentCategory").value;
  const room = document.getElementById("equipmentRoom").value;
  const brand = document.getElementById("equipmentBrand").value.trim();
  const purchaseDate = document.getElementById("purchaseDate").value;
  const price = document.getElementById("equipmentPrice").value;
  const status = document.getElementById("equipmentStatus").value;
  const note = document.getElementById("equipmentNote").value.trim();

  if (!name || !code || !category || !room) {
    showToast("Vui lòng điền đầy đủ thông tin bắt buộc!", "error");
    return;
  }

  // Check duplicate code
  if (equipment.some((e) => e.code === code)) {
    showToast("Mã thiết bị đã tồn tại!", "error");
    return;
  }

  const newEquipment = {
    id: Date.now(),
    name,
    code,
    category,
    room,
    brand,
    purchaseDate,
    price: price ? parseInt(price) : null,
    status,
    note,
    createdAt: new Date().toISOString(),
  };

  equipment.push(newEquipment);
  saveEquipment();

  closeModal("addEquipmentModal");
  renderEquipment();
  renderRooms();
  updateStats();
  showToast("Đã thêm thiết bị thành công!", "success");
}

// ===== View Equipment =====
function viewEquipment(id) {
  const item = equipment.find((e) => e.id === id);
  if (!item) return;

  currentEquipmentId = id;
  const icon = categoryIcons[item.category] || "fa-box";
  const room = rooms.find((r) => r.id === item.room);

  document.getElementById("equipmentDetail").innerHTML = `
    <div class="equipment-detail-header">
      <div class="equipment-detail-icon ${item.category}">
        <i class="fas ${icon}"></i>
      </div>
      <div class="equipment-detail-title">
        <h3>${item.name}</h3>
        <span class="code">${item.code}</span>
      </div>
      <span class="equipment-status ${item.status}">${getStatusText(
    item.status
  )}</span>
    </div>
    <div class="equipment-detail-info">
      <div class="detail-item">
        <i class="fas fa-layer-group"></i>
        <div>
          <span class="label">Danh mục</span>
          <span class="value">${getCategoryName(item.category)}</span>
        </div>
      </div>
      <div class="detail-item">
        <i class="fas fa-door-open"></i>
        <div>
          <span class="label">Phòng</span>
          <span class="value">${room?.name || "N/A"}</span>
        </div>
      </div>
      <div class="detail-item">
        <i class="fas fa-industry"></i>
        <div>
          <span class="label">Hãng sản xuất</span>
          <span class="value">${item.brand || "Không rõ"}</span>
        </div>
      </div>
      <div class="detail-item">
        <i class="fas fa-calendar"></i>
        <div>
          <span class="label">Ngày mua</span>
          <span class="value">${
            item.purchaseDate ? formatDate(item.purchaseDate) : "N/A"
          }</span>
        </div>
      </div>
      <div class="detail-item">
        <i class="fas fa-money-bill"></i>
        <div>
          <span class="label">Giá mua</span>
          <span class="value">${
            item.price ? formatCurrency(item.price) : "N/A"
          }</span>
        </div>
      </div>
      <div class="detail-item">
        <i class="fas fa-sticky-note"></i>
        <div>
          <span class="label">Ghi chú</span>
          <span class="value">${item.note || "Không có"}</span>
        </div>
      </div>
    </div>
  `;

  openModal("viewEquipmentModal");
}

// ===== Set Maintenance =====
function setMaintenance() {
  if (!currentEquipmentId) return;

  const item = equipment.find((e) => e.id === currentEquipmentId);
  if (!item) return;

  if (item.status === "maintenance") {
    item.status = "active";
    showToast("Thiết bị đã hoạt động trở lại!", "success");
  } else {
    item.status = "maintenance";
    showToast("Đã chuyển thiết bị sang bảo trì!", "success");
  }

  saveEquipment();
  closeModal("viewEquipmentModal");
  renderEquipment();
  renderRooms();
  updateStats();
}

// ===== Delete Equipment =====
function deleteCurrentEquipment() {
  if (!currentEquipmentId) return;

  if (confirm("Bạn có chắc muốn xóa thiết bị này?")) {
    equipment = equipment.filter((e) => e.id !== currentEquipmentId);
    saveEquipment();
    closeModal("viewEquipmentModal");
    renderEquipment();
    renderRooms();
    updateStats();
    showToast("Đã xóa thiết bị!", "success");
  }
}

// ===== Helper Functions =====
function getStatusText(status) {
  switch (status) {
    case "active":
      return "Hoạt động";
    case "maintenance":
      return "Bảo trì";
    case "broken":
      return "Hỏng";
    default:
      return status;
  }
}

function getCategoryName(category) {
  switch (category) {
    case "cardio":
      return "Cardio";
    case "strength":
      return "Strength";
    case "free-weight":
      return "Free Weight";
    case "accessories":
      return "Phụ kiện";
    default:
      return category;
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

// ===== Save/Load =====
function saveEquipment() {
  localStorage.setItem("gymEquipment", JSON.stringify(equipment));
}

// ===== Sample Data =====
function loadSampleEquipment() {
  equipment = [
    {
      id: 1,
      name: "Máy chạy bộ Life Fitness",
      code: "TRD-001",
      category: "cardio",
      room: "room3",
      brand: "Life Fitness",
      purchaseDate: "2023-01-15",
      price: 85000000,
      status: "active",
      note: "",
    },
    {
      id: 2,
      name: "Máy chạy bộ Life Fitness",
      code: "TRD-002",
      category: "cardio",
      room: "room3",
      brand: "Life Fitness",
      purchaseDate: "2023-01-15",
      price: 85000000,
      status: "active",
      note: "",
    },
    {
      id: 3,
      name: "Xe đạp tập Technogym",
      code: "BIK-001",
      category: "cardio",
      room: "room3",
      brand: "Technogym",
      purchaseDate: "2023-02-20",
      price: 45000000,
      status: "active",
      note: "",
    },
    {
      id: 4,
      name: "Xe đạp tập Technogym",
      code: "BIK-002",
      category: "cardio",
      room: "room3",
      brand: "Technogym",
      purchaseDate: "2023-02-20",
      price: 45000000,
      status: "maintenance",
      note: "Thay dây curoa",
    },
    {
      id: 5,
      name: "Máy elliptical",
      code: "ELP-001",
      category: "cardio",
      room: "room3",
      brand: "Precor",
      purchaseDate: "2023-03-10",
      price: 65000000,
      status: "active",
      note: "",
    },
    {
      id: 6,
      name: "Máy đẩy ngực",
      code: "CHE-001",
      category: "strength",
      room: "room2",
      brand: "Hammer Strength",
      purchaseDate: "2022-12-01",
      price: 55000000,
      status: "active",
      note: "",
    },
    {
      id: 7,
      name: "Máy kéo cáp",
      code: "CAB-001",
      category: "strength",
      room: "room2",
      brand: "Life Fitness",
      purchaseDate: "2022-12-01",
      price: 48000000,
      status: "active",
      note: "",
    },
    {
      id: 8,
      name: "Máy đạp chân",
      code: "LEG-001",
      category: "strength",
      room: "room2",
      brand: "Hammer Strength",
      purchaseDate: "2023-01-20",
      price: 52000000,
      status: "active",
      note: "",
    },
    {
      id: 9,
      name: "Smith Machine",
      code: "SMT-001",
      category: "strength",
      room: "room2",
      brand: "Rogue",
      purchaseDate: "2023-04-15",
      price: 75000000,
      status: "active",
      note: "",
    },
    {
      id: 10,
      name: "Bộ tạ đơn 1-30kg",
      code: "DUM-001",
      category: "free-weight",
      room: "room2",
      brand: "Rogue",
      purchaseDate: "2023-01-10",
      price: 35000000,
      status: "active",
      note: "Bộ 30 cặp",
    },
    {
      id: 11,
      name: "Thanh đòn Olympic",
      code: "BAR-001",
      category: "free-weight",
      room: "room2",
      brand: "Eleiko",
      purchaseDate: "2023-02-01",
      price: 15000000,
      status: "active",
      note: "",
    },
    {
      id: 12,
      name: "Bộ đĩa tạ Olympic",
      code: "PLT-001",
      category: "free-weight",
      room: "room2",
      brand: "Eleiko",
      purchaseDate: "2023-02-01",
      price: 25000000,
      status: "active",
      note: "200kg tổng",
    },
    {
      id: 13,
      name: "Kettlebell Set",
      code: "KTB-001",
      category: "free-weight",
      room: "room2",
      brand: "Rogue",
      purchaseDate: "2023-03-01",
      price: 12000000,
      status: "active",
      note: "8-32kg",
    },
    {
      id: 14,
      name: "Thảm Yoga",
      code: "MAT-001",
      category: "accessories",
      room: "room1",
      brand: "Manduka",
      purchaseDate: "2023-05-01",
      price: 500000,
      status: "active",
      note: "20 cái",
    },
    {
      id: 15,
      name: "Bóng tập Yoga",
      code: "BAL-001",
      category: "accessories",
      room: "room1",
      brand: "TRX",
      purchaseDate: "2023-05-01",
      price: 300000,
      status: "active",
      note: "15 quả",
    },
    {
      id: 16,
      name: "Dây nhảy Speed Rope",
      code: "ROP-001",
      category: "accessories",
      room: "room4",
      brand: "RX Smart Gear",
      purchaseDate: "2023-04-01",
      price: 200000,
      status: "active",
      note: "20 cái",
    },
    {
      id: 17,
      name: "Găng tay Boxing",
      code: "GLV-001",
      category: "accessories",
      room: "room4",
      brand: "Everlast",
      purchaseDate: "2023-04-01",
      price: 800000,
      status: "active",
      note: "15 đôi",
    },
    {
      id: 18,
      name: "Bao cát Boxing",
      code: "BAG-001",
      category: "accessories",
      room: "room4",
      brand: "Everlast",
      purchaseDate: "2023-04-01",
      price: 5000000,
      status: "active",
      note: "5 cái",
    },
  ];
  saveEquipment();
}

// ===== Toast =====
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  toast.className = `toast ${type}`;
  toastMessage.textContent = message;
  toast.querySelector("i").className =
    type === "success" ? "fas fa-check-circle" : "fas fa-exclamation-circle";

  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// ===== Admin Dropdown =====
function toggleAdminDropdown() {
  const dropdown = document.querySelector(".admin-dropdown");
  dropdown.classList.toggle("active");
}

function confirmLogout() {
  if (confirm("Bạn có chắc muốn đăng xuất?")) {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
  }
}

document.addEventListener("click", (e) => {
  const dropdown = document.querySelector(".admin-dropdown");
  if (dropdown && !dropdown.contains(e.target)) {
    dropdown.classList.remove("active");
  }
});
