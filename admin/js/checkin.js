// ===== Check-in Data =====
let checkins = JSON.parse(localStorage.getItem("gymCheckins")) || [];
let members = JSON.parse(localStorage.getItem("gymMembers")) || [];
let currentMember = null;
let selectedCheckinId = null;

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", function () {
  if (!checkAuth()) return;

  // Load sample members if empty
  if (members.length === 0) {
    loadSampleMembers();
  }

  // Clean old checkins (keep only last 7 days)
  cleanOldCheckins();

  initTheme();
  initSidebar();
  initClock();
  initEventListeners();
  renderCheckinList();
  renderCurrentlyIn();
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

// ===== Clock =====
function initClock() {
  updateClock();
  setInterval(updateClock, 1000);
}

function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  document.getElementById("currentTime").textContent = timeStr;
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

  // Card ID input
  const cardInput = document.getElementById("cardIdInput");
  cardInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      processCheckin();
    }
  });

  cardInput?.addEventListener("input", (e) => {
    e.target.value = e.target.value.toUpperCase();
  });

  // Search
  document
    .getElementById("searchInput")
    ?.addEventListener("input", handleSearch);

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "k") {
      e.preventDefault();
      document.getElementById("searchInput")?.focus();
    }
    if (e.key === "Escape") {
      cancelPreview();
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

// ===== Process Check-in =====
function processCheckin() {
  const cardId = document
    .getElementById("cardIdInput")
    .value.trim()
    .toUpperCase();

  if (!cardId) {
    showToast("Vui lòng nhập mã thẻ!", "error");
    return;
  }

  // Find member
  const member = members.find((m) => m.cardId === cardId);

  if (!member) {
    showToast("Không tìm thấy hội viên với mã thẻ này!", "error");
    return;
  }

  // Check if already checked in today
  const today = new Date().toISOString().split("T")[0];
  const existingCheckin = checkins.find(
    (c) => c.memberId === member.id && c.date === today && !c.checkoutTime
  );

  if (existingCheckin) {
    // Auto checkout
    checkoutById(existingCheckin.id);
    return;
  }

  // Show preview
  currentMember = member;
  showMemberPreview(member);
}

function showMemberPreview(member) {
  const avatarBg = member.gender === "male" ? "3b82f6" : "ec4899";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    member.name
  )}&background=${avatarBg}&color=fff`;

  document.getElementById("previewAvatar").src = avatarUrl;
  document.getElementById("previewName").textContent = member.name;
  document.getElementById("previewCardId").textContent = member.cardId;
  document.getElementById("previewPackage").textContent = member.packageName;
  document.getElementById("previewExpiry").textContent = `Hết hạn: ${formatDate(
    member.endDate
  )}`;

  // Get last checkin
  const lastCheckin = checkins
    .filter((c) => c.memberId === member.id)
    .sort((a, b) => new Date(b.checkinTime) - new Date(a.checkinTime))[0];

  document.getElementById("previewLastCheckin").textContent = lastCheckin
    ? `Lần cuối: ${formatDateTime(lastCheckin.checkinTime)}`
    : "Lần đầu check-in";

  // Status
  const status = getMemberStatus(member.endDate);
  const statusEl = document.getElementById("previewStatus");
  statusEl.innerHTML = `<span class="status-badge ${status}">${getStatusText(
    status
  )}</span>`;

  // Show preview, hide input area
  document.querySelector(".checkin-input-area").style.display = "none";
  document.getElementById("memberPreview").style.display = "block";
  document.getElementById("checkinSuccess").style.display = "none";
}

function cancelPreview() {
  currentMember = null;
  document.querySelector(".checkin-input-area").style.display = "block";
  document.getElementById("memberPreview").style.display = "none";
  document.getElementById("cardIdInput").value = "";
  document.getElementById("cardIdInput").focus();
}

function confirmCheckin() {
  if (!currentMember) return;

  // Check membership status
  const status = getMemberStatus(currentMember.endDate);
  if (status === "expired") {
    showToast("Thẻ hội viên đã hết hạn! Vui lòng gia hạn.", "error");
    return;
  }

  // Create checkin record
  const checkin = {
    id: Date.now(),
    memberId: currentMember.id,
    memberName: currentMember.name,
    cardId: currentMember.cardId,
    date: new Date().toISOString().split("T")[0],
    checkinTime: new Date().toISOString(),
    checkoutTime: null,
  };

  checkins.push(checkin);
  saveCheckins();

  // Show success
  showCheckinSuccess(currentMember.name);

  // Reset after delay
  setTimeout(() => {
    resetCheckinPanel();
  }, 2500);

  // Update UI
  renderCheckinList();
  renderCurrentlyIn();
  updateStats();
}

function showCheckinSuccess(name) {
  document.querySelector(".checkin-input-area").style.display = "none";
  document.getElementById("memberPreview").style.display = "none";
  document.getElementById("checkinSuccess").style.display = "block";
  document.getElementById(
    "successMessage"
  ).textContent = `Chào mừng ${name} đến FitZone!`;
}

function resetCheckinPanel() {
  currentMember = null;
  document.querySelector(".checkin-input-area").style.display = "block";
  document.getElementById("memberPreview").style.display = "none";
  document.getElementById("checkinSuccess").style.display = "none";
  document.getElementById("cardIdInput").value = "";
  document.getElementById("cardIdInput").focus();
}

// ===== Checkout =====
function checkoutById(checkinId) {
  const checkin = checkins.find((c) => c.id === checkinId);
  if (!checkin) return;

  checkin.checkoutTime = new Date().toISOString();
  saveCheckins();

  showToast(`${checkin.memberName} đã check-out!`, "success");

  renderCheckinList();
  renderCurrentlyIn();
  updateStats();
  resetCheckinPanel();
}

function checkoutMember() {
  if (!selectedCheckinId) return;
  checkoutById(selectedCheckinId);
  closeModal("memberDetailModal");
}

// ===== Render Check-in List =====
function renderCheckinList() {
  const container = document.getElementById("checkinList");
  const filter = document.getElementById("filterCheckin")?.value || "all";
  const today = new Date().toISOString().split("T")[0];

  let todayCheckins = checkins
    .filter((c) => c.date === today)
    .sort((a, b) => new Date(b.checkinTime) - new Date(a.checkinTime));

  if (filter === "in") {
    todayCheckins = todayCheckins.filter((c) => !c.checkoutTime);
  } else if (filter === "out") {
    todayCheckins = todayCheckins.filter((c) => c.checkoutTime);
  }

  if (todayCheckins.length === 0) {
    container.innerHTML = `
      <div class="empty-checkin">
        <i class="fas fa-clipboard-list"></i>
        <h3>Chưa có check-in hôm nay</h3>
        <p>Nhập mã thẻ để check-in hội viên</p>
      </div>
    `;
    return;
  }

  container.innerHTML = todayCheckins
    .map((checkin) => {
      const member = members.find((m) => m.id === checkin.memberId);
      const avatarBg = member?.gender === "male" ? "3b82f6" : "ec4899";
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        checkin.memberName
      )}&background=${avatarBg}&color=fff`;
      const checkinTime = new Date(checkin.checkinTime).toLocaleTimeString(
        "vi-VN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

      return `
      <div class="checkin-item" onclick="viewCheckinDetail(${checkin.id})">
        <img src="${avatarUrl}" alt="${checkin.memberName}" />
        <div class="checkin-item-info">
          <h4>${checkin.memberName}</h4>
          <p>${checkin.cardId}</p>
        </div>
        <div class="checkin-item-time">
          <div class="time">${checkinTime}</div>
          <span class="status ${checkin.checkoutTime ? "out" : "in"}">
            ${checkin.checkoutTime ? "Đã ra" : "Đang tập"}
          </span>
        </div>
      </div>
    `;
    })
    .join("");
}

function filterCheckinList() {
  renderCheckinList();
}

// ===== Render Currently In =====
function renderCurrentlyIn() {
  const container = document.getElementById("currentlyInGrid");
  const today = new Date().toISOString().split("T")[0];

  const currentlyIn = checkins.filter(
    (c) => c.date === today && !c.checkoutTime
  );

  document.getElementById("currentCount").textContent = currentlyIn.length;

  if (currentlyIn.length === 0) {
    container.innerHTML = `
      <div class="empty-checkin" style="grid-column: 1/-1;">
        <i class="fas fa-user-clock"></i>
        <h3>Không có hội viên đang tập</h3>
      </div>
    `;
    return;
  }

  container.innerHTML = currentlyIn
    .map((checkin) => {
      const member = members.find((m) => m.id === checkin.memberId);
      const avatarBg = member?.gender === "male" ? "3b82f6" : "ec4899";
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        checkin.memberName
      )}&background=${avatarBg}&color=fff`;
      const checkinTime = new Date(checkin.checkinTime).toLocaleTimeString(
        "vi-VN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

      return `
      <div class="currently-in-item" onclick="viewCheckinDetail(${checkin.id})">
        <img src="${avatarUrl}" alt="${checkin.memberName}" />
        <div class="info">
          <h4>${checkin.memberName}</h4>
          <p><i class="fas fa-clock"></i> Vào lúc ${checkinTime}</p>
        </div>
      </div>
    `;
    })
    .join("");
}

// ===== View Check-in Detail =====
function viewCheckinDetail(checkinId) {
  const checkin = checkins.find((c) => c.id === checkinId);
  if (!checkin) return;

  selectedCheckinId = checkinId;
  const member = members.find((m) => m.id === checkin.memberId);
  const avatarBg = member?.gender === "male" ? "3b82f6" : "ec4899";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    checkin.memberName
  )}&background=${avatarBg}&color=fff`;

  const checkinTime = formatDateTime(checkin.checkinTime);
  const checkoutTime = checkin.checkoutTime
    ? formatDateTime(checkin.checkoutTime)
    : "Chưa check-out";

  document.getElementById("memberDetail").innerHTML = `
    <div class="member-detail-header">
      <img src="${avatarUrl}" alt="${checkin.memberName}" />
      <h3>${checkin.memberName}</h3>
      <p>${checkin.cardId}</p>
    </div>
    <div class="member-detail-info">
      <div class="member-detail-row">
        <i class="fas fa-box"></i>
        <span>${member?.packageName || "N/A"}</span>
      </div>
      <div class="member-detail-row">
        <i class="fas fa-sign-in-alt"></i>
        <span>Check-in: ${checkinTime}</span>
      </div>
      <div class="member-detail-row">
        <i class="fas fa-sign-out-alt"></i>
        <span>Check-out: ${checkoutTime}</span>
      </div>
      <div class="member-detail-row">
        <i class="fas fa-calendar"></i>
        <span>Hết hạn: ${member ? formatDate(member.endDate) : "N/A"}</span>
      </div>
    </div>
  `;

  // Show/hide checkout button
  document.getElementById("checkoutBtn").style.display = checkin.checkoutTime
    ? "none"
    : "inline-flex";

  openModal("memberDetailModal");
}

// ===== Update Stats =====
function updateStats() {
  const today = new Date().toISOString().split("T")[0];
  const todayCheckins = checkins.filter((c) => c.date === today);

  document.getElementById("todayCheckins").textContent = todayCheckins.length;
  document.getElementById("currentlyIn").textContent = todayCheckins.filter(
    (c) => !c.checkoutTime
  ).length;
  document.getElementById("checkedOut").textContent = todayCheckins.filter(
    (c) => c.checkoutTime
  ).length;

  // Calculate average
  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push(d.toISOString().split("T")[0]);
  }
  const last7DaysCheckins = checkins.filter((c) => last7Days.includes(c.date));
  const avg = Math.round(last7DaysCheckins.length / 7);
  document.getElementById("avgDaily").textContent = avg;
}

// ===== Helper Functions =====
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

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ===== Modal =====
function openModal(modalId) {
  document.getElementById(modalId).classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
  document.body.style.overflow = "";
}

// ===== Save/Load =====
function saveCheckins() {
  localStorage.setItem("gymCheckins", JSON.stringify(checkins));
}

function cleanOldCheckins() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const cutoffDate = sevenDaysAgo.toISOString().split("T")[0];

  checkins = checkins.filter((c) => c.date >= cutoffDate);
  saveCheckins();
}

// ===== Sample Members =====
function loadSampleMembers() {
  members = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      cardId: "GYM001",
      gender: "male",
      packageName: "Gói 12 tháng",
      endDate: "2025-06-01",
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      cardId: "GYM002",
      gender: "female",
      packageName: "Gói 6 tháng",
      endDate: "2025-03-01",
    },
    {
      id: 3,
      name: "Lê Minh Cường",
      cardId: "GYM003",
      gender: "male",
      packageName: "Gói 12 tháng",
      endDate: "2025-03-15",
    },
    {
      id: 4,
      name: "Phạm Thu Dung",
      cardId: "GYM004",
      gender: "female",
      packageName: "Gói 6 tháng",
      endDate: "2025-02-01",
    },
    {
      id: 5,
      name: "Hoàng Văn Em",
      cardId: "GYM005",
      gender: "male",
      packageName: "Gói 12 tháng",
      endDate: "2025-05-01",
    },
  ];
  localStorage.setItem("gymMembers", JSON.stringify(members));
}

// ===== Search =====
function handleSearch(e) {
  const term = e.target.value.toLowerCase().trim();
  if (!term) {
    renderCheckinList();
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  const filtered = checkins.filter(
    (c) =>
      c.date === today &&
      (c.memberName.toLowerCase().includes(term) ||
        c.cardId.toLowerCase().includes(term))
  );

  const container = document.getElementById("checkinList");
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-checkin">
        <i class="fas fa-search"></i>
        <h3>Không tìm thấy kết quả</h3>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered
    .map((checkin) => {
      const member = members.find((m) => m.id === checkin.memberId);
      const avatarBg = member?.gender === "male" ? "3b82f6" : "ec4899";
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        checkin.memberName
      )}&background=${avatarBg}&color=fff`;
      const checkinTime = new Date(checkin.checkinTime).toLocaleTimeString(
        "vi-VN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

      return `
      <div class="checkin-item" onclick="viewCheckinDetail(${checkin.id})">
        <img src="${avatarUrl}" alt="${checkin.memberName}" />
        <div class="checkin-item-info">
          <h4>${checkin.memberName}</h4>
          <p>${checkin.cardId}</p>
        </div>
        <div class="checkin-item-time">
          <div class="time">${checkinTime}</div>
          <span class="status ${checkin.checkoutTime ? "out" : "in"}">
            ${checkin.checkoutTime ? "Đã ra" : "Đang tập"}
          </span>
        </div>
      </div>
    `;
    })
    .join("");
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
