// ===== Schedule Data =====
let schedules = JSON.parse(localStorage.getItem("gymSchedules")) || [];
let currentWeekStart = getWeekStart(new Date());
let currentScheduleId = null;

// Sample trainers
const trainers = [
  { id: 1, name: "Nguyễn Văn Hùng", specialty: "Yoga, Gym" },
  { id: 2, name: "Trần Thị Mai", specialty: "Yoga, Dance" },
  { id: 3, name: "Lê Minh Tuấn", specialty: "Gym, Boxing" },
  { id: 4, name: "Phạm Thu Hà", specialty: "Cardio, Dance" },
  { id: 5, name: "Hoàng Văn Nam", specialty: "Boxing, Gym" },
  { id: 6, name: "Vũ Thị Lan", specialty: "Yoga, Cardio" },
  { id: 7, name: "Đặng Quốc Việt", specialty: "PT, Gym" },
  { id: 8, name: "Bùi Thị Hương", specialty: "Dance, Cardio" },
];

// Class type icons
const classIcons = {
  yoga: "fa-spa",
  gym: "fa-dumbbell",
  cardio: "fa-heartbeat",
  boxing: "fa-fist-raised",
  dance: "fa-music",
  pt: "fa-user-ninja",
};

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", function () {
  // Check auth
  if (!checkAuth()) return;

  // Set default date
  document.getElementById("scheduleDate").valueAsDate = new Date();

  // Load sample data if empty
  if (schedules.length === 0) {
    loadSampleSchedules();
  }

  // Initialize
  initTheme();
  initSidebar();
  populateTrainerSelect();
  renderCalendar();
  renderTodaySchedule();
  updateStats();
  initEventListeners();
});

// ===== Check Auth =====
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

  // Keyboard shortcuts
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

// ===== Populate Trainer Select =====
function populateTrainerSelect() {
  const selects = [
    document.getElementById("trainerId"),
    document.getElementById("filterTrainer"),
  ];

  selects.forEach((select) => {
    if (!select) return;
    const isFilter = select.id === "filterTrainer";

    trainers.forEach((trainer) => {
      const option = document.createElement("option");
      option.value = trainer.id;
      option.textContent = trainer.name;
      select.appendChild(option);
    });
  });
}

// ===== Week Navigation =====
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

function changeWeek(direction) {
  currentWeekStart.setDate(currentWeekStart.getDate() + direction * 7);
  renderCalendar();
}

function goToToday() {
  currentWeekStart = getWeekStart(new Date());
  renderCalendar();
}

function updateWeekLabel() {
  const endOfWeek = new Date(currentWeekStart);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  const options = { day: "numeric", month: "short" };
  const startStr = currentWeekStart.toLocaleDateString("vi-VN", options);
  const endStr = endOfWeek.toLocaleDateString("vi-VN", options);

  document.getElementById(
    "currentWeekLabel"
  ).textContent = `${startStr} - ${endStr}`;

  // Update day headers
  const dayColumns = document.querySelectorAll(".calendar-header .day-column");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  dayColumns.forEach((col, index) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + index);

    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    col.innerHTML = `
      <span>${dayNames[index]}</span>
      <span class="day-date">${date.getDate()}/${date.getMonth() + 1}</span>
    `;

    col.classList.toggle("today", date.getTime() === today.getTime());
  });
}

// ===== Render Calendar =====
function renderCalendar() {
  updateWeekLabel();

  const body = document.getElementById("calendarBody");
  body.innerHTML = "";

  // Time slots from 6:00 to 21:00
  for (let hour = 6; hour <= 21; hour++) {
    const row = document.createElement("div");
    row.className = "time-row";

    // Time cell
    const timeCell = document.createElement("div");
    timeCell.className = "time-cell";
    timeCell.textContent = `${hour.toString().padStart(2, "0")}:00`;
    row.appendChild(timeCell);

    // Day cells
    for (let day = 0; day < 7; day++) {
      const dayCell = document.createElement("div");
      dayCell.className = "day-cell";
      dayCell.dataset.day = day;
      dayCell.dataset.hour = hour;

      // Get schedules for this cell
      const cellDate = new Date(currentWeekStart);
      cellDate.setDate(cellDate.getDate() + day);
      const dateStr = cellDate.toISOString().split("T")[0];

      const cellSchedules = schedules.filter((s) => {
        const startHour = parseInt(s.startTime.split(":")[0]);
        return s.date === dateStr && startHour === hour;
      });

      cellSchedules.forEach((schedule) => {
        const event = createScheduleEvent(schedule);
        dayCell.appendChild(event);
      });

      row.appendChild(dayCell);
    }

    body.appendChild(row);
  }
}

function createScheduleEvent(schedule) {
  const event = document.createElement("div");
  event.className = `schedule-event ${schedule.color || "blue"}`;
  event.onclick = () => viewSchedule(schedule.id);

  const trainer = trainers.find((t) => t.id === schedule.trainerId);

  event.innerHTML = `
    <div class="event-title">${schedule.className}</div>
    <div class="event-time">${schedule.startTime} - ${schedule.endTime}</div>
    <div class="event-trainer">${trainer?.name || "N/A"}</div>
  `;

  return event;
}

// ===== Render Today Schedule =====
function renderTodaySchedule() {
  const container = document.getElementById("todayScheduleList");
  const today = new Date().toISOString().split("T")[0];

  const todaySchedules = schedules
    .filter((s) => s.date === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  if (todaySchedules.length === 0) {
    container.innerHTML = `
      <div class="empty-schedule">
        <i class="fas fa-calendar-times"></i>
        <h3>Không có lịch tập hôm nay</h3>
        <p>Nhấn "Thêm lịch tập" để tạo lịch mới</p>
      </div>
    `;
    return;
  }

  container.innerHTML = todaySchedules
    .map((schedule) => {
      const trainer = trainers.find((t) => t.id === schedule.trainerId);
      const duration = calculateDuration(schedule.startTime, schedule.endTime);

      return `
      <div class="schedule-item" onclick="viewSchedule(${schedule.id})">
        <div class="schedule-time">
          <div class="time">${schedule.startTime}</div>
          <div class="duration">${duration} phút</div>
        </div>
        <div class="schedule-info">
          <h4>${schedule.className}</h4>
          <p>
            <span><i class="fas fa-user-ninja"></i> ${
              trainer?.name || "N/A"
            }</span>
            <span><i class="fas fa-map-marker-alt"></i> ${getRoomName(
              schedule.room
            )}</span>
          </p>
        </div>
        <span class="schedule-badge ${schedule.classType}">${getClassTypeName(
        schedule.classType
      )}</span>
        <div class="schedule-participants">
          <i class="fas fa-users"></i>
          <span>${schedule.registered || 0}/${schedule.maxParticipants}</span>
        </div>
      </div>
    `;
    })
    .join("");
}

// ===== Update Stats =====
function updateStats() {
  const today = new Date().toISOString().split("T")[0];
  const todaySchedules = schedules.filter((s) => s.date === today);

  document.getElementById("todayClasses").textContent = todaySchedules.length;
  document.getElementById("totalRegistered").textContent =
    todaySchedules.reduce((sum, s) => sum + (s.registered || 0), 0);
  document.getElementById("activePTs").textContent = trainers.length;

  // Weekly hours
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekSchedules = schedules.filter((s) => {
    const d = new Date(s.date);
    return d >= currentWeekStart && d <= weekEnd;
  });
  const totalMinutes = weekSchedules.reduce((sum, s) => {
    return sum + calculateDuration(s.startTime, s.endTime);
  }, 0);
  document.getElementById("weeklyHours").textContent = Math.round(
    totalMinutes / 60
  );
}

// ===== Helper Functions =====
function calculateDuration(start, end) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}

function getRoomName(room) {
  const rooms = {
    room1: "Phòng 1 - Yoga",
    room2: "Phòng 2 - Gym",
    room3: "Phòng 3 - Cardio",
    room4: "Phòng 4 - Boxing",
    room5: "Phòng 5 - Dance",
  };
  return rooms[room] || room;
}

function getClassTypeName(type) {
  const types = {
    yoga: "Yoga",
    gym: "Gym",
    cardio: "Cardio",
    boxing: "Boxing",
    dance: "Dance",
    pt: "PT 1-1",
  };
  return types[type] || type;
}

function formatDateVN(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
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

  if (modalId === "addScheduleModal") {
    document.getElementById("addScheduleForm").reset();
    document.getElementById("scheduleDate").valueAsDate = new Date();
  }
}

// ===== Add Schedule =====
function addSchedule(event) {
  event.preventDefault();

  const classType = document.getElementById("classType").value;
  const className = document.getElementById("className").value.trim();
  const trainerId = parseInt(document.getElementById("trainerId").value);
  const room = document.getElementById("room").value;
  const date = document.getElementById("scheduleDate").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  const maxParticipants = parseInt(
    document.getElementById("maxParticipants").value
  );
  const color = document.getElementById("classColor").value;
  const note = document.getElementById("scheduleNote").value.trim();
  const repeatType = document.getElementById("repeatType").value;

  if (
    !classType ||
    !className ||
    !trainerId ||
    !room ||
    !date ||
    !startTime ||
    !endTime
  ) {
    showToast("Vui lòng điền đầy đủ thông tin!", "error");
    return;
  }

  if (startTime >= endTime) {
    showToast("Giờ kết thúc phải sau giờ bắt đầu!", "error");
    return;
  }

  // Check conflict
  const hasConflict = schedules.some((s) => {
    if (s.date !== date || s.room !== room) return false;
    return !(endTime <= s.startTime || startTime >= s.endTime);
  });

  if (hasConflict) {
    showToast("Phòng đã có lịch trong khung giờ này!", "error");
    return;
  }

  const newSchedule = {
    id: Date.now(),
    classType,
    className,
    trainerId,
    room,
    date,
    startTime,
    endTime,
    maxParticipants,
    color,
    note,
    registered: 0,
    createdAt: new Date().toISOString(),
  };

  schedules.push(newSchedule);

  // Handle repeat
  if (repeatType !== "none") {
    const repeatDays = repeatType === "daily" ? 30 : 4; // 30 days or 4 weeks
    const interval = repeatType === "daily" ? 1 : 7;

    for (let i = 1; i <= repeatDays; i++) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + i * interval);

      schedules.push({
        ...newSchedule,
        id: Date.now() + i,
        date: newDate.toISOString().split("T")[0],
      });
    }
  }

  saveSchedules();
  closeModal("addScheduleModal");
  renderCalendar();
  renderTodaySchedule();
  updateStats();
  showToast("Đã thêm lịch tập thành công!", "success");
}

// ===== View Schedule =====
function viewSchedule(id) {
  const schedule = schedules.find((s) => s.id === id);
  if (!schedule) return;

  currentScheduleId = id;
  const trainer = trainers.find((t) => t.id === schedule.trainerId);

  document.getElementById("scheduleDetail").innerHTML = `
    <div class="schedule-detail-header">
      <div class="schedule-detail-icon ${schedule.classType}">
        <i class="fas ${classIcons[schedule.classType] || "fa-calendar"}"></i>
      </div>
      <div class="schedule-detail-title">
        <h3>${schedule.className}</h3>
        <p>${getClassTypeName(schedule.classType)}</p>
      </div>
    </div>
    <div class="schedule-detail-info">
      <div class="detail-row">
        <i class="fas fa-calendar"></i>
        <span>${formatDateVN(schedule.date)}</span>
      </div>
      <div class="detail-row">
        <i class="fas fa-clock"></i>
        <span>${schedule.startTime} - ${schedule.endTime} (${calculateDuration(
    schedule.startTime,
    schedule.endTime
  )} phút)</span>
      </div>
      <div class="detail-row">
        <i class="fas fa-user-ninja"></i>
        <span>${trainer?.name || "N/A"}</span>
      </div>
      <div class="detail-row">
        <i class="fas fa-map-marker-alt"></i>
        <span>${getRoomName(schedule.room)}</span>
      </div>
      <div class="detail-row">
        <i class="fas fa-users"></i>
        <span>${schedule.registered || 0}/${
    schedule.maxParticipants
  } học viên</span>
      </div>
      ${
        schedule.note
          ? `
      <div class="detail-row">
        <i class="fas fa-sticky-note"></i>
        <span>${schedule.note}</span>
      </div>
      `
          : ""
      }
    </div>
  `;

  openModal("viewScheduleModal");
}

function deleteCurrentSchedule() {
  if (!currentScheduleId) return;

  if (confirm("Bạn có chắc muốn xóa lịch tập này?")) {
    schedules = schedules.filter((s) => s.id !== currentScheduleId);
    saveSchedules();
    closeModal("viewScheduleModal");
    renderCalendar();
    renderTodaySchedule();
    updateStats();
    showToast("Đã xóa lịch tập!", "success");
  }
}

function editCurrentSchedule() {
  // For simplicity, delete and re-add
  showToast("Tính năng đang phát triển", "error");
}

// ===== Filter =====
function filterSchedule() {
  const classFilter = document.getElementById("filterClass").value;
  const trainerFilter = document.getElementById("filterTrainer").value;

  // Re-render with filters
  renderCalendar();
  renderTodaySchedule();
}

// ===== Search =====
function handleSearch(e) {
  const term = e.target.value.toLowerCase().trim();
  // Simple search - highlight matching schedules
  // For now, just filter today's list
  renderTodaySchedule();
}

// ===== Save/Load =====
function saveSchedules() {
  localStorage.setItem("gymSchedules", JSON.stringify(schedules));
}

// ===== Sample Data =====
function loadSampleSchedules() {
  const today = new Date();
  const dates = [];
  for (let i = -3; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }

  schedules = [
    {
      id: 1,
      classType: "yoga",
      className: "Yoga buổi sáng",
      trainerId: 2,
      room: "room1",
      date: dates[3],
      startTime: "06:00",
      endTime: "07:00",
      maxParticipants: 20,
      color: "purple",
      registered: 15,
    },
    {
      id: 2,
      classType: "gym",
      className: "Gym cơ bản",
      trainerId: 3,
      room: "room2",
      date: dates[3],
      startTime: "08:00",
      endTime: "09:30",
      maxParticipants: 15,
      color: "blue",
      registered: 12,
    },
    {
      id: 3,
      classType: "cardio",
      className: "Cardio đốt mỡ",
      trainerId: 4,
      room: "room3",
      date: dates[3],
      startTime: "10:00",
      endTime: "11:00",
      maxParticipants: 25,
      color: "green",
      registered: 20,
    },
    {
      id: 4,
      classType: "boxing",
      className: "Boxing cơ bản",
      trainerId: 5,
      room: "room4",
      date: dates[3],
      startTime: "14:00",
      endTime: "15:30",
      maxParticipants: 12,
      color: "orange",
      registered: 8,
    },
    {
      id: 5,
      classType: "dance",
      className: "Zumba",
      trainerId: 8,
      room: "room5",
      date: dates[3],
      startTime: "17:00",
      endTime: "18:00",
      maxParticipants: 30,
      color: "pink",
      registered: 25,
    },
    {
      id: 6,
      classType: "pt",
      className: "PT - Nguyễn Văn A",
      trainerId: 7,
      room: "room2",
      date: dates[3],
      startTime: "19:00",
      endTime: "20:00",
      maxParticipants: 1,
      color: "orange",
      registered: 1,
    },
    {
      id: 7,
      classType: "yoga",
      className: "Yoga tối",
      trainerId: 6,
      room: "room1",
      date: dates[3],
      startTime: "20:00",
      endTime: "21:00",
      maxParticipants: 20,
      color: "purple",
      registered: 18,
    },
    // More schedules for other days
    {
      id: 8,
      classType: "gym",
      className: "Gym nâng cao",
      trainerId: 3,
      room: "room2",
      date: dates[4],
      startTime: "09:00",
      endTime: "10:30",
      maxParticipants: 10,
      color: "blue",
      registered: 7,
    },
    {
      id: 9,
      classType: "cardio",
      className: "HIIT",
      trainerId: 4,
      room: "room3",
      date: dates[4],
      startTime: "17:00",
      endTime: "18:00",
      maxParticipants: 20,
      color: "green",
      registered: 15,
    },
    {
      id: 10,
      classType: "yoga",
      className: "Yoga buổi sáng",
      trainerId: 2,
      room: "room1",
      date: dates[5],
      startTime: "06:00",
      endTime: "07:00",
      maxParticipants: 20,
      color: "purple",
      registered: 12,
    },
  ];

  saveSchedules();
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

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  const dropdown = document.querySelector(".admin-dropdown");
  if (dropdown && !dropdown.contains(e.target)) {
    dropdown.classList.remove("active");
  }
});
