// ===== Report Data =====
let members = JSON.parse(localStorage.getItem("gymMembers")) || [];
let invoices = JSON.parse(localStorage.getItem("gymInvoices")) || [];
let checkins = JSON.parse(localStorage.getItem("gymCheckins")) || [];

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", function () {
  if (!checkAuth()) return;

  // Load sample data if empty
  if (members.length === 0) loadSampleMembers();
  if (invoices.length === 0) loadSampleInvoices();

  initTheme();
  initSidebar();
  initEventListeners();
  updateReports();
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
  if (icon) icon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
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
  if (saved === "true")
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

// ===== Update Reports =====
function updateReports() {
  const period = document.getElementById("reportPeriod").value;
  const { startDate, endDate } = getPeriodDates(period);

  updateOverviewStats(startDate, endDate);
  renderRevenueChart(startDate, endDate);
  renderMembersPieChart();
  renderTopPackages();
  renderRecentTransactions();
  renderPeakHours();
  updateSummary();
}

function getPeriodDates(period) {
  const now = new Date();
  let startDate = new Date();

  switch (period) {
    case "week":
      startDate.setDate(now.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(now.getMonth(), 1);
      break;
    case "quarter":
      const quarter = Math.floor(now.getMonth() / 3);
      startDate.setMonth(quarter * 3, 1);
      break;
    case "year":
      startDate.setMonth(0, 1);
      break;
  }

  return { startDate, endDate: now };
}

// ===== Overview Stats =====
function updateOverviewStats(startDate, endDate) {
  const periodInvoices = invoices.filter((i) => {
    const date = new Date(i.createdAt);
    return date >= startDate && date <= endDate && i.status === "paid";
  });

  const totalRevenue = periodInvoices.reduce((sum, i) => sum + i.total, 0);
  const newMembersCount = members.filter((m) => {
    const date = new Date(m.createdAt);
    return date >= startDate && date <= endDate;
  }).length;

  const periodCheckins = checkins.filter((c) => {
    const date = new Date(c.checkinTime);
    return date >= startDate && date <= endDate;
  }).length;

  document.getElementById("totalRevenue").textContent =
    formatCurrencyShort(totalRevenue);
  document.getElementById("newMembers").textContent = newMembersCount;
  document.getElementById("totalCheckins").textContent = periodCheckins;
  document.getElementById("totalInvoices").textContent = periodInvoices.length;

  // Trends (mock data for demo)
  document.getElementById("revenueTrend").innerHTML =
    '<i class="fas fa-arrow-up"></i> <span>12%</span>';
  document.getElementById("memberTrend").innerHTML =
    '<i class="fas fa-arrow-up"></i> <span>8%</span>';
  document.getElementById("checkinTrend").innerHTML =
    '<i class="fas fa-arrow-up"></i> <span>15%</span>';
  document.getElementById("invoiceTrend").innerHTML =
    '<i class="fas fa-arrow-up"></i> <span>10%</span>';
}

// ===== Revenue Chart =====
function renderRevenueChart(startDate, endDate) {
  const barsContainer = document.getElementById("revenueBars");
  const labelsContainer = document.getElementById("revenueLabels");

  // Generate daily data for last 7 days or monthly data
  const period = document.getElementById("reportPeriod").value;
  let data = [];

  if (period === "week") {
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayRevenue = invoices
        .filter(
          (inv) => inv.createdAt.startsWith(dateStr) && inv.status === "paid"
        )
        .reduce((sum, inv) => sum + inv.total, 0);
      data.push({
        label: date.toLocaleDateString("vi-VN", { weekday: "short" }),
        value: dayRevenue,
      });
    }
  } else {
    // Monthly data - last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthRevenue = invoices
        .filter(
          (inv) => inv.createdAt.startsWith(monthStr) && inv.status === "paid"
        )
        .reduce((sum, inv) => sum + inv.total, 0);
      data.push({
        label: date.toLocaleDateString("vi-VN", { month: "short" }),
        value: monthRevenue,
      });
    }
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  barsContainer.innerHTML = data
    .map((d) => {
      const height = (d.value / maxValue) * 100;
      return `<div class="chart-bar" style="height: ${Math.max(
        height,
        5
      )}%" data-value="${formatCurrencyShort(d.value)}"></div>`;
    })
    .join("");

  labelsContainer.innerHTML = data
    .map((d) => `<div class="chart-label">${d.label}</div>`)
    .join("");
}

// ===== Members Pie Chart =====
function renderMembersPieChart() {
  const active = members.filter(
    (m) => getMemberStatus(m.endDate) === "active"
  ).length;
  const expiring = members.filter(
    (m) => getMemberStatus(m.endDate) === "expiring"
  ).length;
  const expired = members.filter(
    (m) => getMemberStatus(m.endDate) === "expired"
  ).length;

  const total = active + expiring + expired || 1;
  const activePercent = (active / total) * 100;
  const expiringPercent = (expiring / total) * 100;
  const expiredPercent = (expired / total) * 100;

  const pieChart = document.getElementById("membersPieChart");
  pieChart.style.background = `conic-gradient(
    #10b981 0% ${activePercent}%,
    #f59e0b ${activePercent}% ${activePercent + expiringPercent}%,
    #ef4444 ${activePercent + expiringPercent}% 100%
  )`;

  document.getElementById("membersLegend").innerHTML = `
    <div class="legend-item">
      <span class="legend-color" style="background: #10b981"></span>
      <span>Còn hạn</span>
      <span class="legend-value">${active}</span>
    </div>
    <div class="legend-item">
      <span class="legend-color" style="background: #f59e0b"></span>
      <span>Sắp hết hạn</span>
      <span class="legend-value">${expiring}</span>
    </div>
    <div class="legend-item">
      <span class="legend-color" style="background: #ef4444"></span>
      <span>Hết hạn</span>
      <span class="legend-value">${expired}</span>
    </div>
  `;
}

// ===== Top Packages =====
function renderTopPackages() {
  const packageCounts = {};

  invoices
    .filter((i) => i.type === "membership" && i.status === "paid")
    .forEach((i) => {
      packageCounts[i.itemName] = (packageCounts[i.itemName] || 0) + 1;
    });

  const sorted = Object.entries(packageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const container = document.getElementById("topPackages");

  if (sorted.length === 0) {
    container.innerHTML =
      '<p style="color: var(--text-muted); text-align: center; padding: 20px;">Chưa có dữ liệu</p>';
    return;
  }

  container.innerHTML = sorted
    .map((item, index) => {
      const positionClass =
        index === 0
          ? "gold"
          : index === 1
          ? "silver"
          : index === 2
          ? "bronze"
          : "normal";
      return `
        <div class="ranking-item">
          <div class="ranking-position ${positionClass}">${index + 1}</div>
          <div class="ranking-info">
            <h4>${item[0]}</h4>
            <p>${item[1]} lượt đăng ký</p>
          </div>
          <span class="ranking-value">${item[1]}</span>
        </div>
      `;
    })
    .join("");
}

// ===== Recent Transactions =====
function renderRecentTransactions() {
  const recent = [...invoices]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const container = document.getElementById("recentTransactions");

  if (recent.length === 0) {
    container.innerHTML =
      '<p style="color: var(--text-muted); text-align: center; padding: 20px;">Chưa có giao dịch</p>';
    return;
  }

  container.innerHTML = recent
    .map(
      (inv) => `
      <div class="transaction-item">
        <div class="transaction-icon income">
          <i class="fas fa-arrow-down"></i>
        </div>
        <div class="transaction-info">
          <h4>${inv.customerName}</h4>
          <p>${inv.description} • ${formatDate(inv.createdAt)}</p>
        </div>
        <span class="transaction-amount income">+${formatCurrency(
          inv.total
        )}</span>
      </div>
    `
    )
    .join("");
}

// ===== Peak Hours =====
function renderPeakHours() {
  // Mock data for peak hours
  const peakData = [
    { time: "6:00 - 8:00", value: 45 },
    { time: "8:00 - 10:00", value: 30 },
    { time: "10:00 - 12:00", value: 20 },
    { time: "12:00 - 14:00", value: 15 },
    { time: "14:00 - 16:00", value: 25 },
    { time: "16:00 - 18:00", value: 60 },
    { time: "18:00 - 20:00", value: 85 },
    { time: "20:00 - 22:00", value: 55 },
  ];

  const maxValue = Math.max(...peakData.map((d) => d.value));

  document.getElementById("peakHours").innerHTML = peakData
    .map((item) => {
      const width = (item.value / maxValue) * 100;
      return `
        <div class="peak-hour-item">
          <span class="peak-hour-time">${item.time}</span>
          <div class="peak-hour-bar">
            <div class="peak-hour-fill" style="width: ${width}%"></div>
          </div>
          <span class="peak-hour-value">${item.value}%</span>
        </div>
      `;
    })
    .join("");
}

// ===== Update Summary =====
function updateSummary() {
  const total = members.length;
  const active = members.filter(
    (m) => getMemberStatus(m.endDate) === "active"
  ).length;
  const expiring = members.filter(
    (m) => getMemberStatus(m.endDate) === "expiring"
  ).length;

  document.getElementById("summaryTotalMembers").textContent = `${total} người`;
  document.getElementById(
    "summaryActiveMembers"
  ).textContent = `${active} người`;
  document.getElementById(
    "summaryExpiringMembers"
  ).textContent = `${expiring} người`;
  document.getElementById("summaryRenewalRate").textContent =
    total > 0 ? `${Math.round((active / total) * 100)}%` : "0%";
}

// ===== Export Report =====
function exportReport() {
  showToast("Tính năng xuất báo cáo đang phát triển", "error");
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

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

function formatCurrencyShort(amount) {
  if (amount >= 1000000) return (amount / 1000000).toFixed(1) + "M";
  if (amount >= 1000) return (amount / 1000).toFixed(0) + "K";
  return amount.toString();
}

// ===== Sample Data =====
function loadSampleMembers() {
  members = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      cardId: "GYM001",
      endDate: "2025-06-01",
      createdAt: "2024-06-01",
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      cardId: "GYM002",
      endDate: "2025-03-01",
      createdAt: "2024-09-01",
    },
    {
      id: 3,
      name: "Lê Minh Cường",
      cardId: "GYM003",
      endDate: "2025-03-15",
      createdAt: "2024-03-15",
    },
    {
      id: 4,
      name: "Phạm Thu Dung",
      cardId: "GYM004",
      endDate: "2025-02-01",
      createdAt: "2024-08-01",
    },
    {
      id: 5,
      name: "Hoàng Văn Em",
      cardId: "GYM005",
      endDate: "2025-05-01",
      createdAt: "2024-05-01",
    },
    {
      id: 6,
      name: "Vũ Thị Phương",
      cardId: "GYM006",
      endDate: "2025-04-01",
      createdAt: "2024-10-01",
    },
    {
      id: 7,
      name: "Đặng Quốc Giang",
      cardId: "GYM007",
      endDate: "2025-04-01",
      createdAt: "2024-04-01",
    },
    {
      id: 8,
      name: "Bùi Thị Hạnh",
      cardId: "GYM008",
      endDate: "2025-02-01",
      createdAt: "2024-11-01",
    },
    {
      id: 9,
      name: "Ngô Văn Inh",
      cardId: "GYM009",
      endDate: "2025-01-15",
      createdAt: "2024-07-15",
    },
    {
      id: 10,
      name: "Lý Thị Kim",
      cardId: "GYM010",
      endDate: "2025-02-01",
      createdAt: "2024-02-01",
    },
    {
      id: 11,
      name: "Trịnh Văn Long",
      cardId: "GYM011",
      endDate: "2024-12-10",
      createdAt: "2024-11-10",
    },
    {
      id: 12,
      name: "Mai Thị Ngọc",
      cardId: "GYM012",
      endDate: "2024-12-12",
      createdAt: "2024-09-12",
    },
    {
      id: 13,
      name: "Cao Văn Oanh",
      cardId: "GYM013",
      endDate: "2024-12-14",
      createdAt: "2024-11-14",
    },
    {
      id: 14,
      name: "Đinh Thị Phúc",
      cardId: "GYM014",
      endDate: "2024-11-01",
      createdAt: "2024-10-01",
    },
    {
      id: 15,
      name: "Tạ Văn Quân",
      cardId: "GYM015",
      endDate: "2024-09-01",
      createdAt: "2024-06-01",
    },
  ];
  localStorage.setItem("gymMembers", JSON.stringify(members));
}

function loadSampleInvoices() {
  const now = new Date();
  invoices = [
    {
      id: 1,
      invoiceId: "INV202412001",
      customerId: 1,
      customerName: "Nguyễn Văn An",
      type: "membership",
      itemName: "Gói 12 tháng",
      description: "Gói 12 tháng",
      total: 3500000,
      status: "paid",
      createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
    },
    {
      id: 2,
      invoiceId: "INV202412002",
      customerId: 2,
      customerName: "Trần Thị Bình",
      type: "membership",
      itemName: "Gói 6 tháng",
      description: "Gói 6 tháng",
      total: 1800000,
      status: "paid",
      createdAt: new Date(now.getFullYear(), now.getMonth(), 3).toISOString(),
    },
    {
      id: 3,
      invoiceId: "INV202412003",
      customerId: 3,
      customerName: "Lê Minh Cường",
      type: "pt",
      itemName: "PT 10 buổi",
      description: "PT 10 buổi",
      total: 2500000,
      status: "paid",
      createdAt: new Date(now.getFullYear(), now.getMonth(), 5).toISOString(),
    },
    {
      id: 4,
      invoiceId: "INV202412004",
      customerId: 4,
      customerName: "Phạm Thu Dung",
      type: "product",
      itemName: "Whey Protein",
      description: "Whey Protein x2",
      total: 1520000,
      status: "paid",
      createdAt: new Date(now.getFullYear(), now.getMonth(), 10).toISOString(),
    },
    {
      id: 5,
      invoiceId: "INV202412005",
      customerId: 5,
      customerName: "Hoàng Văn Em",
      type: "membership",
      itemName: "Gói 3 tháng",
      description: "Gói 3 tháng",
      total: 1200000,
      status: "paid",
      createdAt: new Date(now.getFullYear(), now.getMonth(), 15).toISOString(),
    },
    {
      id: 6,
      invoiceId: "INV202412006",
      customerId: 6,
      customerName: "Vũ Thị Phương",
      type: "membership",
      itemName: "Gói 6 tháng",
      description: "Gói 6 tháng",
      total: 2000000,
      status: "paid",
      createdAt: new Date(now.getFullYear(), now.getMonth(), 18).toISOString(),
    },
    {
      id: 7,
      invoiceId: "INV202411001",
      customerId: 7,
      customerName: "Đặng Quốc Giang",
      type: "membership",
      itemName: "Gói 12 tháng",
      description: "Gói 12 tháng",
      total: 3500000,
      status: "paid",
      createdAt: new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        5
      ).toISOString(),
    },
    {
      id: 8,
      invoiceId: "INV202411002",
      customerId: 8,
      customerName: "Bùi Thị Hạnh",
      type: "membership",
      itemName: "Gói 3 tháng",
      description: "Gói 3 tháng",
      total: 1200000,
      status: "paid",
      createdAt: new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        12
      ).toISOString(),
    },
  ];
  localStorage.setItem("gymInvoices", JSON.stringify(invoices));
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
