// ===== Settings Data =====
let settings =
  JSON.parse(localStorage.getItem("gymSettings")) || getDefaultSettings();

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", function () {
  if (!checkAuth()) return;

  initTheme();
  initSidebar();
  initEventListeners();
  loadSettings();
});

// ===== Default Settings =====
function getDefaultSettings() {
  return {
    gymName: "FitZone Gym",
    gymPhone: "0123 456 789",
    gymEmail: "contact@fitzone.vn",
    gymAddress: "123 Đường ABC, Quận XYZ, TP.HCM",
    darkMode: false,
    sidebarCollapsed: false,
    language: "vi",
    expiryNotification: true,
    reminderDays: "7",
    checkinSound: true,
    openTime: "06:00",
    closeTime: "22:00",
    closedDays: "none",
  };
}

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
  if (icon) icon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const newTheme = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);

  // Update toggle
  document.getElementById("darkModeToggle").checked = newTheme === "dark";
}

function toggleDarkMode() {
  const isDark = document.getElementById("darkModeToggle").checked;
  const newTheme = isDark ? "dark" : "light";
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

function toggleSidebarDefault() {
  const isCollapsed = document.getElementById("sidebarCollapsedToggle").checked;
  localStorage.setItem("sidebarCollapsed", isCollapsed);

  const sidebar = document.getElementById("sidebar");
  if (isCollapsed) {
    sidebar.classList.add("collapsed");
  } else {
    sidebar.classList.remove("collapsed");
  }
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

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "k") {
      e.preventDefault();
      document.getElementById("searchInput")?.focus();
    }
  });
}

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}

// ===== Load Settings =====
function loadSettings() {
  // General
  document.getElementById("gymName").value = settings.gymName;
  document.getElementById("gymPhone").value = settings.gymPhone;
  document.getElementById("gymEmail").value = settings.gymEmail;
  document.getElementById("gymAddress").value = settings.gymAddress;

  // Display
  const currentTheme = localStorage.getItem("theme") || "light";
  document.getElementById("darkModeToggle").checked = currentTheme === "dark";

  const sidebarCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
  document.getElementById("sidebarCollapsedToggle").checked = sidebarCollapsed;

  document.getElementById("language").value = settings.language;

  // Notifications
  document.getElementById("expiryNotification").checked =
    settings.expiryNotification;
  document.getElementById("reminderDays").value = settings.reminderDays;
  document.getElementById("checkinSound").checked = settings.checkinSound;

  // Business
  document.getElementById("openTime").value = settings.openTime;
  document.getElementById("closeTime").value = settings.closeTime;
  document.getElementById("closedDays").value = settings.closedDays;
}

// ===== Save Settings =====
function saveSettings() {
  settings = {
    gymName: document.getElementById("gymName").value,
    gymPhone: document.getElementById("gymPhone").value,
    gymEmail: document.getElementById("gymEmail").value,
    gymAddress: document.getElementById("gymAddress").value,
    darkMode: document.getElementById("darkModeToggle").checked,
    sidebarCollapsed: document.getElementById("sidebarCollapsedToggle").checked,
    language: document.getElementById("language").value,
    expiryNotification: document.getElementById("expiryNotification").checked,
    reminderDays: document.getElementById("reminderDays").value,
    checkinSound: document.getElementById("checkinSound").checked,
    openTime: document.getElementById("openTime").value,
    closeTime: document.getElementById("closeTime").value,
    closedDays: document.getElementById("closedDays").value,
  };

  localStorage.setItem("gymSettings", JSON.stringify(settings));
  showToast("Đã lưu cài đặt thành công!", "success");
}

// ===== Reset Settings =====
function resetSettings() {
  if (confirm("Bạn có chắc muốn đặt lại tất cả cài đặt về mặc định?")) {
    settings = getDefaultSettings();
    localStorage.setItem("gymSettings", JSON.stringify(settings));
    localStorage.setItem("theme", "light");
    localStorage.setItem("sidebarCollapsed", "false");

    loadSettings();
    initTheme();
    initSidebar();

    showToast("Đã đặt lại cài đặt mặc định!", "success");
  }
}

// ===== Data Management =====
function exportData() {
  const data = {
    settings: JSON.parse(localStorage.getItem("gymSettings") || "{}"),
    members: JSON.parse(localStorage.getItem("gymMembers") || "[]"),
    invoices: JSON.parse(localStorage.getItem("gymInvoices") || "[]"),
    checkins: JSON.parse(localStorage.getItem("gymCheckins") || "[]"),
    schedules: JSON.parse(localStorage.getItem("gymSchedules") || "[]"),
    equipment: JSON.parse(localStorage.getItem("gymEquipment") || "[]"),
    trainers: JSON.parse(localStorage.getItem("gymTrainers") || "[]"),
    packages: JSON.parse(localStorage.getItem("gymPackages") || "[]"),
    exportDate: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `fitzone-backup-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);

  showToast("Đã xuất dữ liệu thành công!", "success");
}

function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);

        if (
          confirm(
            "Nhập dữ liệu sẽ ghi đè dữ liệu hiện tại. Bạn có chắc muốn tiếp tục?"
          )
        ) {
          if (data.settings)
            localStorage.setItem("gymSettings", JSON.stringify(data.settings));
          if (data.members)
            localStorage.setItem("gymMembers", JSON.stringify(data.members));
          if (data.invoices)
            localStorage.setItem("gymInvoices", JSON.stringify(data.invoices));
          if (data.checkins)
            localStorage.setItem("gymCheckins", JSON.stringify(data.checkins));
          if (data.schedules)
            localStorage.setItem(
              "gymSchedules",
              JSON.stringify(data.schedules)
            );
          if (data.equipment)
            localStorage.setItem(
              "gymEquipment",
              JSON.stringify(data.equipment)
            );
          if (data.trainers)
            localStorage.setItem("gymTrainers", JSON.stringify(data.trainers));
          if (data.packages)
            localStorage.setItem("gymPackages", JSON.stringify(data.packages));

          showToast("Đã nhập dữ liệu thành công! Đang tải lại...", "success");
          setTimeout(() => location.reload(), 1500);
        }
      } catch (err) {
        showToast("File không hợp lệ!", "error");
      }
    };
    reader.readAsText(file);
  };

  input.click();
}

function clearAllData() {
  if (
    confirm(
      "CẢNH BÁO: Hành động này sẽ xóa TẤT CẢ dữ liệu và không thể hoàn tác!\n\nBạn có chắc chắn muốn tiếp tục?"
    )
  ) {
    if (confirm("Xác nhận lần cuối: Xóa toàn bộ dữ liệu?")) {
      localStorage.removeItem("gymMembers");
      localStorage.removeItem("gymInvoices");
      localStorage.removeItem("gymCheckins");
      localStorage.removeItem("gymSchedules");
      localStorage.removeItem("gymEquipment");
      localStorage.removeItem("gymTrainers");
      localStorage.removeItem("gymPackages");

      showToast("Đã xóa toàn bộ dữ liệu!", "success");
    }
  }
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
  document.querySelector(".admin-dropdown").classList.toggle("active");
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
  if (dropdown && !dropdown.contains(e.target))
    dropdown.classList.remove("active");
});
