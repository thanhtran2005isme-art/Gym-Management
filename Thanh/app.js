// Global State
let currentUser = null;
let currentView = "dashboard";

// Initialize Sample Data
function initializeData() {
  if (!localStorage.getItem("gym_members")) {
    const sampleMembers = [
      {
        id: "MEM001",
        name: "Nguyễn Văn A",
        phone: "0901234567",
        email: "vana@email.com",
        dob: "1990-05-15",
        gender: "male",
        address: "123 Đường ABC, Q1, TP.HCM",
        package: "3months",
        startDate: "2024-09-01",
        endDate: "2024-12-01",
        status: "active",
        registeredDate: "2024-09-01",
        notes: "",
      },
      {
        id: "MEM002",
        name: "Trần Thị B",
        phone: "0907654321",
        email: "thib@email.com",
        dob: "1995-08-20",
        gender: "female",
        address: "456 Đường XYZ, Q2, TP.HCM",
        package: "1year",
        startDate: "2024-01-15",
        endDate: "2025-01-15",
        status: "active",
        registeredDate: "2024-01-15",
        notes: "",
      },
      {
        id: "MEM003",
        name: "Lê Văn C",
        phone: "0909876543",
        email: "vanc@email.com",
        dob: "1988-03-10",
        gender: "male",
        address: "789 Đường DEF, Q3, TP.HCM",
        package: "1month",
        startDate: "2024-10-25",
        endDate: "2024-11-25",
        status: "expiring",
        registeredDate: "2024-10-25",
        notes: "",
      },
    ];
    localStorage.setItem("gym_members", JSON.stringify(sampleMembers));

    const sampleTrainers = [
      {
        id: "TR001",
        name: "PT Minh Tuấn",
        phone: "0911111111",
        email: "minhtuan@gym.com",
        specialty: "Bodybuilding, Fitness",
        experience: "5 năm",
        certifications: "ACE-CPT, NASM",
      },
      {
        id: "TR002",
        name: "PT Lan Anh",
        phone: "0922222222",
        email: "lananh@gym.com",
        specialty: "Yoga, Pilates",
        experience: "3 năm",
        certifications: "RYT-200",
      },
    ];
    localStorage.setItem("gym_trainers", JSON.stringify(sampleTrainers));

    const sampleSchedules = [
      {
        id: "SCH001",
        memberId: "MEM001",
        trainerId: "TR001",
        date: "2024-11-22",
        time: "08:00",
        facility: "room1",
        status: "scheduled",
        notes: "Buổi tập đầu tiên",
      },
    ];
    localStorage.setItem("gym_schedules", JSON.stringify(sampleSchedules));

    const sampleCheckins = [
      {
        id: "CHK001",
        memberId: "MEM001",
        date: "2024-11-21",
        time: "07:30",
        facility: "cardio",
      },
    ];
    localStorage.setItem("gym_checkins", JSON.stringify(sampleCheckins));

    const sampleInvoices = [
      {
        id: "INV001",
        memberId: "MEM001",
        amount: 1350000,
        package: "3months",
        date: "2024-09-01",
        status: "paid",
        paymentMethod: "cash",
      },
    ];
    localStorage.setItem("gym_invoices", JSON.stringify(sampleInvoices));
  }
}

// Authentication
function showLogin() {
  document.getElementById("loginScreen").style.display = "block";
  document.getElementById("mainApp").style.display = "none";
}

function showMainApp() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
  renderSidebar();
  renderContent();
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  showLogin();
}

function getRoleName(role) {
  const roles = {
    admin: "Admin",
    trainer: "Huấn luyện viên",
    member: "Hội viên",
  };
  return roles[role] || role;
}


// Sidebar Menu
function renderSidebar() {
  const sidebar = document.getElementById("sidebar");
  const menus = {
    admin: [
      { id: "dashboard", icon: "📊", label: "Tổng quan" },
      { id: "members", icon: "👥", label: "Quản lý hội viên" },
      { id: "memberships", icon: "💳", label: "Gói dịch vụ" },
      { id: "trainers", icon: "🏋️", label: "Huấn luyện viên" },
      { id: "schedules", icon: "📅", label: "Lịch tập" },
      { id: "checkins", icon: "✅", label: "Check-in" },
      { id: "facilities", icon: "🏢", label: "Phòng/Thiết bị" },
      { id: "invoices", icon: "💰", label: "Thu chi" },
      { id: "reports", icon: "📈", label: "Báo cáo" },
    ],
    trainer: [
      { id: "dashboard", icon: "📊", label: "Tổng quan" },
      { id: "schedules", icon: "📅", label: "Lịch của tôi" },
      { id: "members", icon: "👥", label: "Học viên" },
      { id: "checkins", icon: "✅", label: "Check-in" },
    ],
    member: [
      { id: "dashboard", icon: "📊", label: "Trang chủ" },
      { id: "mySchedules", icon: "📅", label: "Lịch tập của tôi" },
      { id: "myMembership", icon: "💳", label: "Thẻ của tôi" },
      { id: "myCheckins", icon: "✅", label: "Lịch sử tập" },
      { id: "myInvoices", icon: "💰", label: "Hóa đơn" },
    ],
  };

  const userMenus = menus[currentUser.role] || menus.member;
  sidebar.innerHTML = userMenus
    .map(
      (menu) => `
      <div class="menu-item ${menu.id === currentView ? "active" : ""}" onclick="navigateTo('${menu.id}')">
          <span style="font-size: 20px;">${menu.icon}</span>
          <span>${menu.label}</span>
      </div>
  `
    )
    .join("");
}

function navigateTo(view) {
  currentView = view;
  renderSidebar();
  renderContent();
}

// Content Rendering
function renderContent() {
  const contentArea = document.getElementById("contentArea");

  switch (currentView) {
    case "dashboard":
      renderDashboard();
      break;
    case "members":
      renderMembers();
      break;
    case "memberships":
      renderMemberships();
      break;
    case "trainers":
      renderTrainers();
      break;
    case "schedules":
      renderSchedules();
      break;
    case "checkins":
      renderCheckins();
      break;
    case "facilities":
      renderFacilities();
      break;
    case "invoices":
      renderInvoices();
      break;
    case "reports":
      renderReports();
      break;
    case "mySchedules":
      renderMySchedules();
      break;
    case "myMembership":
      renderMyMembership();
      break;
    case "myCheckins":
      renderMyCheckins();
      break;
    case "myInvoices":
      renderMyInvoices();
      break;
    default:
      renderDashboard();
  }
}

// Dashboard
function renderDashboard() {
  const members = JSON.parse(localStorage.getItem("gym_members") || "[]");
  const checkins = JSON.parse(localStorage.getItem("gym_checkins") || "[]");
  const invoices = JSON.parse(localStorage.getItem("gym_invoices") || "[]");

  const activeMembers = members.filter((m) => m.status === "active").length;
  const expiringMembers = members.filter((m) => m.status === "expiring").length;
  const todayCheckins = checkins.filter(
    (c) => c.date === new Date().toISOString().split("T")[0]
  ).length;
  const monthRevenue = invoices
    .filter((i) => i.date.startsWith("2024-11"))
    .reduce((sum, i) => sum + i.amount, 0);

  const contentArea = document.getElementById("contentArea");
  contentArea.innerHTML = `
      <div class="section-header">
          <h2>📊 Tổng quan hệ thống</h2>
      </div>
      
      <div class="dashboard-grid">
          <div class="stat-card">
              <h3>Hội viên hoạt động</h3>
              <div class="number">${activeMembers}</div>
          </div>
          <div class="stat-card warning">
              <h3>Sắp hết hạn</h3>
              <div class="number">${expiringMembers}</div>
          </div>
          <div class="stat-card">
              <h3>Check-in hôm nay</h3>
              <div class="number">${todayCheckins}</div>
          </div>
          <div class="stat-card revenue">
              <h3>Doanh thu tháng này</h3>
              <div class="number">${formatCurrency(monthRevenue)}</div>
          </div>
      </div>

      ${
        expiringMembers > 0
          ? `
      <div class="alert alert-warning">
          ⚠️ Có ${expiringMembers} hội viên sắp hết hạn thẻ. Hãy liên hệ để gia hạn!
      </div>
      `
          : ""
      }

      <div class="section-header">
          <h3>📅 Lịch tập hôm nay</h3>
      </div>
      ${renderTodaySchedules()}

      <div class="section-header" style="margin-top: 30px;">
          <h3>📋 Hoạt động gần đây</h3>
      </div>
      ${renderRecentActivity()}
  `;
}


function renderTodaySchedules() {
  const schedules = JSON.parse(localStorage.getItem("gym_schedules") || "[]");
  const members = JSON.parse(localStorage.getItem("gym_members") || "[]");
  const trainers = JSON.parse(localStorage.getItem("gym_trainers") || "[]");
  const today = new Date().toISOString().split("T")[0];

  const todaySchedules = schedules.filter((s) => s.date === today);

  if (todaySchedules.length === 0) {
    return '<div class="empty-state">Không có lịch tập nào hôm nay</div>';
  }

  return `
      <div class="schedule-grid">
          ${todaySchedules
            .map((schedule) => {
              const member = members.find((m) => m.id === schedule.memberId);
              const trainer = trainers.find((t) => t.id === schedule.trainerId);
              return `
                  <div class="schedule-card">
                      <h4>⏰ ${schedule.time}</h4>
                      <div class="schedule-info">👤 Hội viên: ${member?.name || "N/A"}</div>
                      <div class="schedule-info">🏋️ PT: ${trainer?.name || "N/A"}</div>
                      <div class="schedule-info">🏢 ${getFacilityName(schedule.facility)}</div>
                      ${schedule.notes ? `<div class="schedule-info">📝 ${schedule.notes}</div>` : ""}
                  </div>
              `;
            })
            .join("")}
      </div>
  `;
}

function renderRecentActivity() {
  const checkins = JSON.parse(localStorage.getItem("gym_checkins") || "[]");
  const members = JSON.parse(localStorage.getItem("gym_members") || "[]");

  const recentCheckins = checkins.slice(-10).reverse();

  if (recentCheckins.length === 0) {
    return '<div class="empty-state">Chưa có hoạt động nào</div>';
  }

  return `
      <div class="table-container">
          <table>
              <thead>
                  <tr>
                      <th>Thời gian</th>
                      <th>Hội viên</th>
                      <th>Khu vực</th>
                  </tr>
              </thead>
              <tbody>
                  ${recentCheckins
                    .map((checkin) => {
                      const member = members.find((m) => m.id === checkin.memberId);
                      return `
                          <tr>
                              <td>${checkin.date} ${checkin.time}</td>
                              <td>${member?.name || "N/A"}</td>
                              <td>${getFacilityName(checkin.facility)}</td>
                          </tr>
                      `;
                    })
                    .join("")}
              </tbody>
          </table>
      </div>
  `;
}

// Members Management
function renderMembers() {
  const members = JSON.parse(localStorage.getItem("gym_members") || "[]");
  const contentArea = document.getElementById("contentArea");

  contentArea.innerHTML = `
      <div class="section-header">
          <h2>👥 Quản lý hội viên</h2>
          ${currentUser.role === "admin" ? '<button class="btn-add" onclick="openMemberModal()">+ Thêm hội viên</button>' : ""}
      </div>

      <div class="filter-bar">
          <input type="text" id="searchMember" placeholder="🔍 Tìm theo tên, SĐT, email..." oninput="filterMembers()">
          <select id="filterStatus" onchange="filterMembers()">
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="expiring">Sắp hết hạn</option>
              <option value="expired">Hết hạn</option>
          </select>
      </div>

      <div class="table-container" id="membersTable">
          ${renderMembersTable(members)}
      </div>
  `;
}

function renderMembersTable(members) {
  if (members.length === 0) {
    return '<div class="empty-state">Chưa có hội viên nào</div>';
  }

  return `
      <table>
          <thead>
              <tr>
                  <th>Mã HV</th>
                  <th>Họ tên</th>
                  <th>SĐT</th>
                  <th>Gói dịch vụ</th>
                  <th>Ngày hết hạn</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
              </tr>
          </thead>
          <tbody>
              ${members
                .map(
                  (member) => `
                  <tr>
                      <td><strong>${member.id}</strong></td>
                      <td>${member.name}</td>
                      <td>${member.phone}</td>
                      <td>${getPackageName(member.package)}</td>
                      <td>${formatDate(member.endDate)}</td>
                      <td><span class="badge ${member.status}">${getStatusName(member.status)}</span></td>
                      <td>
                          <div class="actions">
                              <button class="btn-icon btn-qr" onclick="showQRCode('${member.id}')" title="Mã QR">📱</button>
                              ${
                                currentUser.role === "admin"
                                  ? `
                                  <button class="btn-icon btn-edit" onclick="editMember('${member.id}')" title="Sửa">✏️</button>
                                  <button class="btn-icon btn-delete" onclick="deleteMember('${member.id}')" title="Xóa">🗑️</button>
                              `
                                  : ""
                              }
                          </div>
                      </td>
                  </tr>
              `
                )
                .join("")}
          </tbody>
      </table>
  `;
}

function filterMembers() {
  const searchText = document.getElementById("searchMember").value.toLowerCase();
  const statusFilter = document.getElementById("filterStatus").value;
  const members = JSON.parse(localStorage.getItem("gym_members") || "[]");

  let filtered = members.filter((member) => {
    const matchSearch =
      member.name.toLowerCase().includes(searchText) ||
      member.phone.includes(searchText) ||
      member.email.toLowerCase().includes(searchText);
    const matchStatus = !statusFilter || member.status === statusFilter;
    return matchSearch && matchStatus;
  });

  document.getElementById("membersTable").innerHTML = renderMembersTable(filtered);
}


function openMemberModal(memberId = null) {
  const modal = document.getElementById("memberModal");
  const form = document.getElementById("memberForm");
  form.reset();

  if (memberId) {
    const members = JSON.parse(localStorage.getItem("gym_members") || "[]");
    const member = members.find((m) => m.id === memberId);
    if (member) {
      document.getElementById("memberModalTitle").textContent = "Chỉnh sửa hội viên";
      document.getElementById("memberId").value = member.id;
      document.getElementById("memberName").value = member.name;
      document.getElementById("memberPhone").value = member.phone;
      document.getElementById("memberEmail").value = member.email || "";
      document.getElementById("memberDob").value = member.dob || "";
      document.getElementById("memberGender").value = member.gender;
      document.getElementById("memberPackage").value = member.package;
      document.getElementById("memberAddress").value = member.address || "";
      document.getElementById("memberNotes").value = member.notes || "";
    }
  } else {
    document.getElementById("memberModalTitle").textContent = "Thêm hội viên mới";
  }

  modal.classList.add("show");
}

function editMember(memberId) {
  openMemberModal(memberId);
}

function deleteMember(memberId) {
  if (confirm("Bạn có chắc chắn muốn xóa hội viên này?")) {
    let members = JSON.parse(localStorage.getItem("gym_members") || "[]");
    members = members.filter((m) => m.id !== memberId);
    localStorage.setItem("gym_members", JSON.stringify(members));
    renderMembers();
  }
}

function calculateEndDate(startDate, packageType) {
  const date = new Date(startDate);
  switch (packageType) {
    case "1month":
      date.setMonth(date.getMonth() + 1);
      break;
    case "3months":
      date.setMonth(date.getMonth() + 3);
      break;
    case "6months":
      date.setMonth(date.getMonth() + 6);
      break;
    case "1year":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date;
}

// Schedules
function renderSchedules() {
  const schedules = JSON.parse(localStorage.getItem("gym_schedules") || "[]");
  const members = JSON.parse(localStorage.getItem("gym_members") || "[]");
  const trainers = JSON.parse(localStorage.getItem("gym_trainers") || "[]");
  const contentArea = document.getElementById("contentArea");

  contentArea.innerHTML = `
      <div class="section-header">
          <h2>📅 Quản lý lịch tập</h2>
          <button class="btn-add" onclick="openScheduleModal()">+ Đặt lịch mới</button>
      </div>

      <div class="filter-bar">
          <input type="date" id="filterDate" onchange="filterSchedules()">
          <select id="filterTrainer" onchange="filterSchedules()">
              <option value="">Tất cả PT</option>
              ${trainers.map((t) => `<option value="${t.id}">${t.name}</option>`).join("")}
          </select>
      </div>

      <div id="schedulesContainer">
          ${renderSchedulesGrid(schedules, members, trainers)}
      </div>
  `;
}

function renderSchedulesGrid(schedules, members, trainers) {
  if (schedules.length === 0) {
    return '<div class="empty-state">Chưa có lịch tập nào</div>';
  }

  return `
      <div class="schedule-grid">
          ${schedules
            .map((schedule) => {
              const member = members.find((m) => m.id === schedule.memberId);
              const trainer = trainers.find((t) => t.id === schedule.trainerId);
              return `
                  <div class="schedule-card">
                      <h4>📅 ${formatDate(schedule.date)}</h4>
                      <div class="schedule-info">⏰ ${schedule.time}</div>
                      <div class="schedule-info">👤 HV: ${member?.name || "N/A"}</div>
                      <div class="schedule-info">🏋️ PT: ${trainer?.name || "N/A"}</div>
                      <div class="schedule-info">🏢 ${getFacilityName(schedule.facility)}</div>
                      ${schedule.notes ? `<div class="schedule-info">📝 ${schedule.notes}</div>` : ""}
                      ${
                        currentUser.role === "admin"
                          ? `
                          <div class="actions" style="margin-top: 10px;">
                              <button class="btn-icon btn-edit" onclick="editSchedule('${schedule.id}')">✏️ Sửa</button>
                              <button class="btn-icon btn-delete" onclick="deleteSchedule('${schedule.id}')">🗑️ Xóa</button>
                          </div>
                      `
                          : ""
                      }
                  </div>
              `;
            })
            .join("")}
      </div>
  `;
}

function openScheduleModal(scheduleId = null) {
  const modal = document.getElementById("scheduleModal");
  const form = document.getElementById("scheduleForm");
  const members = JSON.parse(localStorage.getItem("gym_members") || "[]");
  const trainers = JSON.parse(localStorage.getItem("gym_trainers") || "[]");

  const memberSelect = document.getElementById("scheduleMember");
  memberSelect.innerHTML = members.map((m) => `<option value="${m.id}">${m.name} (${m.id})</option>`).join("");

  const trainerSelect = document.getElementById("scheduleTrainer");
  trainerSelect.innerHTML = trainers.map((t) => `<option value="${t.id}">${t.name}</option>`).join("");

  form.reset();

  if (scheduleId) {
    const schedules = JSON.parse(localStorage.getItem("gym_schedules") || "[]");
    const schedule = schedules.find((s) => s.id === scheduleId);
    if (schedule) {
      document.getElementById("scheduleId").value = schedule.id;
      document.getElementById("scheduleMember").value = schedule.memberId;
      document.getElementById("scheduleTrainer").value = schedule.trainerId;
      document.getElementById("scheduleDate").value = schedule.date;
      document.getElementById("scheduleTime").value = schedule.time;
      document.getElementById("scheduleFacility").value = schedule.facility;
      document.getElementById("scheduleNotes").value = schedule.notes || "";
    }
  }

  modal.classList.add("show");
}

function editSchedule(scheduleId) {
  openScheduleModal(scheduleId);
}

function deleteSchedule(scheduleId) {
  if (confirm("Bạn có chắc chắn muốn xóa lịch tập này?")) {
    let schedules = JSON.parse(localStorage.getItem("gym_schedules") || "[]");
    schedules = schedules.filter((s) => s.id !== scheduleId);
    localStorage.setItem("gym_schedules", JSON.stringify(schedules));
    renderSchedules();
  }
}


// Check-in
function renderCheckins() {
  const contentArea = document.getElementById("contentArea");
  contentArea.innerHTML = `
      <div class="section-header">
          <h2>✅ Quản lý Check-in</h2>
      </div>

      <div class="checkin-scanner">
          <h3 style="margin-bottom: 20px;">Nhập mã hội viên hoặc quét QR</h3>
          <input type="text" 
                 class="checkin-input" 
                 id="checkinInput" 
                 placeholder="MEM001"
                 autofocus>
          <button class="btn-primary" onclick="processCheckin()" style="margin-top: 20px; max-width: 400px;">
              Check-in
          </button>
      </div>

      <div class="section-header" style="margin-top: 40px;">
          <h3>Lịch sử check-in hôm nay</h3>
      </div>
      ${renderTodayCheckins()}
  `;

  document.getElementById("checkinInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      processCheckin();
    }
  });
}

function processCheckin() {
  const memberId = document.getElementById("checkinInput").value.trim().toUpperCase();
  const members = JSON.parse(localStorage.getItem("gym_members") || "[]");
  const member = members.find((m) => m.id === memberId);

  if (!member) {
    alert("❌ Không tìm thấy hội viên với mã: " + memberId);
    return;
  }

  if (member.status === "expired") {
    alert("⚠️ Thẻ hội viên đã hết hạn! Vui lòng gia hạn.");
    return;
  }

  const checkin = {
    id: "CHK" + String(Date.now()).slice(-6),
    memberId: memberId,
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    facility: "main",
  };

  let checkins = JSON.parse(localStorage.getItem("gym_checkins") || "[]");
  checkins.push(checkin);
  localStorage.setItem("gym_checkins", JSON.stringify(checkins));

  alert(`✅ Check-in thành công!\n\nHội viên: ${member.name}\nThời gian: ${checkin.time}`);
  document.getElementById("checkinInput").value = "";
  renderCheckins();
}

function renderTodayCheckins() {
  const checkins = JSON.parse(localStorage.getItem("gym_checkins") || "[]");
  const members = JSON.parse(localStorage.getItem("gym_members") || "[]");
  const today = new Date().toISOString().split("T")[0];
  const todayCheckins = checkins.filter((c) => c.date === today);

  if (todayCheckins.length === 0) {
    return '<div class="empty-state">Chưa có check-in nào hôm nay</div>';
  }

  return `
      <div class="table-container">
          <table>
              <thead>
                  <tr>
                      <th>Thời gian</th>
                      <th>Mã HV</th>
                      <th>Họ tên</th>
                      <th>Khu vực</th>
                  </tr>
              </thead>
              <tbody>
                  ${todayCheckins
                    .reverse()
                    .map((checkin) => {
                      const member = members.find((m) => m.id === checkin.memberId);
                      return `
                          <tr>
                              <td><strong>${checkin.time}</strong></td>
                              <td>${checkin.memberId}</td>
                              <td>${member?.name || "N/A"}</td>
                              <td>${getFacilityName(checkin.facility)}</td>
                          </tr>
                      `;
                    })
                    .join("")}
              </tbody>
          </table>
      </div>
  `;
}

// QR Code
function showQRCode(memberId) {
  const members = JSON.parse(localStorage.getItem("gym_members") || "[]");
  const member = members.find((m) => m.id === memberId);

  if (!member) return;

  const qrData = JSON.stringify({
    id: member.id,
    name: member.name,
    expiry: member.endDate,
  });

  document.getElementById("qrMemberCard").innerHTML = `
      <h3>TRUNG TÂM THỂ DỤC FITNESS</h3>
      <div class="name">${member.name}</div>
      <div class="details">Mã HV: ${member.id}</div>
      <div class="details">Gói: ${getPackageName(member.package)}</div>
      <div class="details">Hạn: ${formatDate(member.endDate)}</div>
  `;

  const canvas = document.getElementById("qrCanvas");
  QRCode.toCanvas(canvas, qrData, {
    width: 300,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });

  document.getElementById("qrModal").classList.add("show");
}

// Invoices
function renderInvoices() {
  const invoices = JSON.parse(localStorage.getItem("gym_invoices") || "[]");
  const members = JSON.parse(localStorage.getItem("gym_members") || "[]");
  const contentArea = document.getElementById("contentArea");

  contentArea.innerHTML = `
      <div class="section-header">
          <h2>💰 Quản lý thu chi</h2>
      </div>

      <div class="table-container">
          <table>
              <thead>
                  <tr>
                      <th>Mã HĐ</th>
                      <th>Ngày</th>
                      <th>Hội viên</th>
                      <th>Gói dịch vụ</th>
                      <th>Số tiền</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                  </tr>
              </thead>
              <tbody>
                  ${invoices
                    .reverse()
                    .map((invoice) => {
                      const member = members.find((m) => m.id === invoice.memberId);
                      return `
                          <tr>
                              <td><strong>${invoice.id}</strong></td>
                              <td>${formatDate(invoice.date)}</td>
                              <td>${member?.name || "N/A"}</td>
                              <td>${getPackageName(invoice.package)}</td>
                              <td><strong>${formatCurrency(invoice.amount)}</strong></td>
                              <td><span class="badge ${invoice.status === "paid" ? "active" : "expired"}">${
                        invoice.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"
                      }</span></td>
                              <td>
                                  <button class="btn-icon" onclick="viewInvoice('${invoice.id}')" title="Xem">👁️</button>
                              </td>
                          </tr>
                      `;
                    })
                    .join("")}
              </tbody>
          </table>
      </div>
  `;
}


function viewInvoice(invoiceId) {
  const invoices = JSON.parse(localStorage.getItem("gym_invoices") || "[]");
  const members = JSON.parse(localStorage.getItem("gym_members") || "[]");
  const invoice = invoices.find((i) => i.id === invoiceId);
  const member = members.find((m) => m.id === invoice.memberId);

  if (!invoice) return;

  document.getElementById("invoicePreview").innerHTML = `
      <div class="invoice-header">
          <h2>🏋️ TRUNG TÂM THỂ DỤC FITNESS</h2>
          <p>123 Đường ABC, Quận 1, TP.HCM</p>
          <p>Hotline: 0900 123 456</p>
      </div>
      <h3 style="text-align: center; color: #667eea; margin-bottom: 20px;">HÓA ĐƠN THANH TOÁN</h3>
      <div class="invoice-details">
          <div>
              <p><strong>Mã hóa đơn:</strong> ${invoice.id}</p>
              <p><strong>Ngày:</strong> ${formatDate(invoice.date)}</p>
              <p><strong>Phương thức:</strong> ${invoice.paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản"}</p>
          </div>
          <div>
              <p><strong>Khách hàng:</strong> ${member?.name || "N/A"}</p>
              <p><strong>Mã HV:</strong> ${invoice.memberId}</p>
              <p><strong>SĐT:</strong> ${member?.phone || "N/A"}</p>
          </div>
      </div>
      <div class="invoice-items">
          <table style="width: 100%;">
              <thead style="background: #f8f9fa; color: #333;">
                  <tr>
                      <th style="text-align: left;">Dịch vụ</th>
                      <th style="text-align: right;">Số tiền</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>Gói tập: ${getPackageName(invoice.package)}</td>
                      <td style="text-align: right;">${formatCurrency(invoice.amount)}</td>
                  </tr>
              </tbody>
          </table>
      </div>
      <div class="invoice-total">
          Tổng cộng: ${formatCurrency(invoice.amount)}
      </div>
      <p style="text-align: center; margin-top: 30px; color: #666;">
          Cảm ơn quý khách! Chúc quý khách tập luyện hiệu quả!
      </p>
  `;

  document.getElementById("invoiceModal").classList.add("show");
}

// Reports
function renderReports() {
  const members = JSON.parse(localStorage.getItem("gym_members") || "[]");
  const invoices = JSON.parse(localStorage.getItem("gym_invoices") || "[]");
  const checkins = JSON.parse(localStorage.getItem("gym_checkins") || "[]");

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === "active").length;
  const totalRevenue = invoices.reduce((sum, i) => sum + i.amount, 0);
  const monthRevenue = invoices
    .filter((i) => i.date.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((sum, i) => sum + i.amount, 0);

  const contentArea = document.getElementById("contentArea");
  contentArea.innerHTML = `
      <div class="section-header">
          <h2>📈 Báo cáo & Thống kê</h2>
      </div>

      <div class="tabs">
          <button class="tab active" onclick="switchReportTab('overview')">Tổng quan</button>
          <button class="tab" onclick="switchReportTab('revenue')">Doanh thu</button>
          <button class="tab" onclick="switchReportTab('members')">Hội viên</button>
      </div>

      <div id="reportContent">
          <div class="dashboard-grid">
              <div class="stat-card">
                  <h3>Tổng số hội viên</h3>
                  <div class="number">${totalMembers}</div>
              </div>
              <div class="stat-card">
                  <h3>Hội viên hoạt động</h3>
                  <div class="number">${activeMembers}</div>
              </div>
              <div class="stat-card revenue">
                  <h3>Doanh thu tháng này</h3>
                  <div class="number">${formatCurrency(monthRevenue)}</div>
              </div>
              <div class="stat-card revenue">
                  <h3>Tổng doanh thu</h3>
                  <div class="number">${formatCurrency(totalRevenue)}</div>
              </div>
          </div>

          <div style="margin-top: 30px;">
              <h3>📊 Thống kê gói dịch vụ</h3>
              ${renderPackageStats(members)}
          </div>

          <div style="margin-top: 30px;">
              <h3>📅 Check-in theo tháng</h3>
              ${renderCheckinStats(checkins)}
          </div>
      </div>
  `;
}

function renderPackageStats(members) {
  const packageStats = members.reduce((acc, member) => {
    acc[member.package] = (acc[member.package] || 0) + 1;
    return acc;
  }, {});

  return `
      <div class="table-container">
          <table>
              <thead>
                  <tr>
                      <th>Gói dịch vụ</th>
                      <th>Số lượng</th>
                      <th>Tỷ lệ</th>
                  </tr>
              </thead>
              <tbody>
                  ${Object.entries(packageStats)
                    .map(
                      ([pkg, count]) => `
                      <tr>
                          <td>${getPackageName(pkg)}</td>
                          <td><strong>${count}</strong></td>
                          <td>${((count / members.length) * 100).toFixed(1)}%</td>
                      </tr>
                  `
                    )
                    .join("")}
              </tbody>
          </table>
      </div>
  `;
}

function renderCheckinStats(checkins) {
  const today = new Date();
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    last7Days.push(date.toISOString().split("T")[0]);
  }

  return `
      <div class="table-container">
          <table>
              <thead>
                  <tr>
                      <th>Ngày</th>
                      <th>Số lượt check-in</th>
                  </tr>
              </thead>
              <tbody>
                  ${last7Days
                    .map((date) => {
                      const count = checkins.filter((c) => c.date === date).length;
                      return `
                          <tr>
                              <td>${formatDate(date)}</td>
                              <td><strong>${count}</strong></td>
                          </tr>
                      `;
                    })
                    .join("")}
              </tbody>
          </table>
      </div>
  `;
}


// Other views
function renderMemberships() {
  const contentArea = document.getElementById("contentArea");
  contentArea.innerHTML = `
      <div class="section-header">
          <h2>💳 Gói dịch vụ</h2>
      </div>

      <div class="dashboard-grid">
          <div class="stat-card">
              <h3>Gói 1 Tháng</h3>
              <div class="number">500,000đ</div>
              <p style="color: #666; margin-top: 10px;">Phù hợp để trải nghiệm</p>
          </div>
          <div class="stat-card">
              <h3>Gói 3 Tháng</h3>
              <div class="number">1,350,000đ</div>
              <p style="color: #666; margin-top: 10px;">Tiết kiệm 10%</p>
          </div>
          <div class="stat-card">
              <h3>Gói 6 Tháng</h3>
              <div class="number">2,500,000đ</div>
              <p style="color: #666; margin-top: 10px;">Tiết kiệm 17%</p>
          </div>
          <div class="stat-card">
              <h3>Gói 1 Năm</h3>
              <div class="number">4,500,000đ</div>
              <p style="color: #666; margin-top: 10px;">Tiết kiệm 25%</p>
          </div>
      </div>

      <div style="margin-top: 30px; background: white; padding: 30px; border-radius: 12px;">
          <h3 style="margin-bottom: 20px;">Quyền lợi hội viên</h3>
          <ul style="line-height: 2; color: #666;">
              <li>✅ Sử dụng toàn bộ thiết bị tập luyện hiện đại</li>
              <li>✅ Tham gia các lớp tập Yoga, Aerobic, Zumba</li>
              <li>✅ Được tư vấn chế độ tập luyện miễn phí</li>
              <li>✅ Sử dụng phòng thay đồ và tủ khóa</li>
              <li>✅ Giảm giá 20% khi thuê PT riêng</li>
              <li>✅ Ưu đãi đặc biệt vào sinh nhật</li>
          </ul>
      </div>
  `;
}

function renderTrainers() {
  const trainers = JSON.parse(localStorage.getItem("gym_trainers") || "[]");
  const contentArea = document.getElementById("contentArea");

  contentArea.innerHTML = `
      <div class="section-header">
          <h2>🏋️ Đội ngũ Huấn luyện viên</h2>
      </div>

      <div class="dashboard-grid">
          ${trainers
            .map(
              (trainer) => `
              <div class="stat-card">
                  <h3 style="color: #667eea; font-size: 18px; text-transform: none;">${trainer.name}</h3>
                  <p style="color: #666; margin: 10px 0;">📱 ${trainer.phone}</p>
                  <p style="color: #666; margin: 5px 0;">✉️ ${trainer.email}</p>
                  <p style="color: #666; margin: 5px 0;"><strong>Chuyên môn:</strong> ${trainer.specialty}</p>
                  <p style="color: #666; margin: 5px 0;"><strong>Kinh nghiệm:</strong> ${trainer.experience}</p>
                  <p style="color: #666; margin: 5px 0;"><strong>Chứng chỉ:</strong> ${trainer.certifications}</p>
              </div>
          `
            )
            .join("")}
      </div>
  `;
}

function renderFacilities() {
  const contentArea = document.getElementById("contentArea");
  contentArea.innerHTML = `
      <div class="section-header">
          <h2>🏢 Phòng tập & Thiết bị</h2>
      </div>

      <div class="dashboard-grid">
          <div class="stat-card">
              <h3 style="color: #667eea; font-size: 18px; text-transform: none;">Phòng tập 1</h3>
              <p style="color: #666; margin: 10px 0;">Diện tích: 200m²</p>
              <p style="color: #666;">Sức chứa: 30 người</p>
              <p style="color: #666;">Thiết bị: Tạ đa năng, Máy chạy bộ</p>
          </div>
          <div class="stat-card">
              <h3 style="color: #667eea; font-size: 18px; text-transform: none;">Phòng tập 2</h3>
              <p style="color: #666; margin: 10px 0;">Diện tích: 150m²</p>
              <p style="color: #666;">Sức chứa: 20 người</p>
              <p style="color: #666;">Thiết bị: Xe đạp, Máy chèo</p>
          </div>
          <div class="stat-card">
              <h3 style="color: #667eea; font-size: 18px; text-transform: none;">Khu Cardio</h3>
              <p style="color: #666; margin: 10px 0;">Diện tích: 100m²</p>
              <p style="color: #666;">10 máy chạy bộ</p>
              <p style="color: #666;">8 xe đạp tập</p>
          </div>
          <div class="stat-card">
              <h3 style="color: #667eea; font-size: 18px; text-transform: none;">Phòng Yoga</h3>
              <p style="color: #666; margin: 10px 0;">Diện tích: 80m²</p>
              <p style="color: #666;">Sức chứa: 25 người</p>
              <p style="color: #666;">Lớp học: 6:00, 18:00</p>
          </div>
      </div>
  `;
}

// Member views
function renderMySchedules() {
  renderSchedules();
}

function renderMyMembership() {
  const contentArea = document.getElementById("contentArea");
  contentArea.innerHTML = `
      <div class="section-header">
          <h2>💳 Thẻ hội viên của tôi</h2>
      </div>
      <div class="member-card-preview" style="margin: 40px auto;">
          <h3>TRUNG TÂM THỂ DỤC FITNESS</h3>
          <div class="name">Hội viên Demo</div>
          <div class="details">Mã HV: MEM001</div>
          <div class="details">Gói: 3 Tháng</div>
          <div class="details">Hạn: 01/12/2024</div>
          <div class="details">Trạng thái: Đang hoạt động</div>
      </div>
      <div style="text-align: center;">
          <button class="btn-primary" style="max-width: 300px;">Gia hạn thẻ</button>
      </div>
  `;
}

function renderMyCheckins() {
  renderCheckins();
}

function renderMyInvoices() {
  renderInvoices();
}


// Utility Functions
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("show");
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN");
}

function getPackageName(packageId) {
  const packages = {
    "1month": "1 Tháng",
    "3months": "3 Tháng",
    "6months": "6 Tháng",
    "1year": "1 Năm",
  };
  return packages[packageId] || packageId;
}

function getPackagePrice(packageId) {
  const prices = {
    "1month": 500000,
    "3months": 1350000,
    "6months": 2500000,
    "1year": 4500000,
  };
  return prices[packageId] || 0;
}

function getStatusName(status) {
  const statuses = {
    active: "Hoạt động",
    expiring: "Sắp hết hạn",
    expired: "Hết hạn",
  };
  return statuses[status] || status;
}

function getFacilityName(facilityId) {
  const facilities = {
    room1: "Phòng tập 1",
    room2: "Phòng tập 2",
    cardio: "Khu Cardio",
    weights: "Khu Tạ tự do",
    yoga: "Phòng Yoga",
    main: "Khu vực chính",
  };
  return facilities[facilityId] || facilityId;
}

function filterSchedules() {
  renderSchedules();
}

function switchReportTab(tab) {
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  event.target.classList.add("active");
}

// Initialize Application
window.addEventListener("DOMContentLoaded", function () {
  initializeData();

  // Login form handler
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    const role = document.getElementById("loginRole").value;

    if (password === username || (username === "admin" && password === "admin")) {
      currentUser = {
        username: username,
        role: role,
        name:
          role === "admin"
            ? "Quản trị viên"
            : role === "trainer"
            ? "PT " + username
            : "Hội viên " + username,
      };
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      document.getElementById("currentUserBadge").textContent =
        currentUser.name + " (" + getRoleName(role) + ")";
      showMainApp();
    } else {
      alert("Sai tên đăng nhập hoặc mật khẩu!");
    }
  });

  // Member form handler
  document.getElementById("memberForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const memberId = document.getElementById("memberId").value;
    const packageType = document.getElementById("memberPackage").value;
    const startDate = new Date();
    const endDate = calculateEndDate(startDate, packageType);

    const memberData = {
      id: memberId || "MEM" + String(Date.now()).slice(-6),
      name: document.getElementById("memberName").value,
      phone: document.getElementById("memberPhone").value,
      email: document.getElementById("memberEmail").value,
      dob: document.getElementById("memberDob").value,
      gender: document.getElementById("memberGender").value,
      address: document.getElementById("memberAddress").value,
      package: packageType,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      status: "active",
      registeredDate: memberId ? undefined : startDate.toISOString().split("T")[0],
      notes: document.getElementById("memberNotes").value,
    };

    let members = JSON.parse(localStorage.getItem("gym_members") || "[]");

    if (memberId) {
      const index = members.findIndex((m) => m.id === memberId);
      if (index !== -1) {
        members[index] = { ...members[index], ...memberData };
      }
    } else {
      members.push(memberData);

      const invoice = {
        id: "INV" + String(Date.now()).slice(-6),
        memberId: memberData.id,
        amount: getPackagePrice(packageType),
        package: packageType,
        date: startDate.toISOString().split("T")[0],
        status: "paid",
        paymentMethod: "cash",
      };
      let invoices = JSON.parse(localStorage.getItem("gym_invoices") || "[]");
      invoices.push(invoice);
      localStorage.setItem("gym_invoices", JSON.stringify(invoices));
    }

    localStorage.setItem("gym_members", JSON.stringify(members));
    closeModal("memberModal");
    renderMembers();

    if (!memberId) {
      alert("✅ Đăng ký hội viên thành công!\nMã hội viên: " + memberData.id);
    }
  });

  // Schedule form handler
  document.getElementById("scheduleForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const scheduleId = document.getElementById("scheduleId").value;
    const scheduleData = {
      id: scheduleId || "SCH" + String(Date.now()).slice(-6),
      memberId: document.getElementById("scheduleMember").value,
      trainerId: document.getElementById("scheduleTrainer").value,
      date: document.getElementById("scheduleDate").value,
      time: document.getElementById("scheduleTime").value,
      facility: document.getElementById("scheduleFacility").value,
      status: "scheduled",
      notes: document.getElementById("scheduleNotes").value,
    };

    let schedules = JSON.parse(localStorage.getItem("gym_schedules") || "[]");

    if (scheduleId) {
      const index = schedules.findIndex((s) => s.id === scheduleId);
      if (index !== -1) {
        schedules[index] = scheduleData;
      }
    } else {
      schedules.push(scheduleData);
    }

    localStorage.setItem("gym_schedules", JSON.stringify(schedules));
    closeModal("scheduleModal");
    renderSchedules();
    alert("✅ Đặt lịch thành công!");
  });

  // Check saved user
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    document.getElementById("currentUserBadge").textContent =
      currentUser.name + " (" + getRoleName(currentUser.role) + ")";
    showMainApp();
  } else {
    showLogin();
  }

  // Check for expiring memberships
  const members = JSON.parse(localStorage.getItem("gym_members") || "[]");
  members.forEach((member) => {
    const endDate = new Date(member.endDate);
    const today = new Date();
    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      member.status = "expired";
    } else if (daysLeft <= 7) {
      member.status = "expiring";
    } else {
      member.status = "active";
    }
  });
  localStorage.setItem("gym_members", JSON.stringify(members));
});

// Close modals when clicking outside
window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.classList.remove("show");
  }
};
