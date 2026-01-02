// ===== Utility Functions =====

// Format currency VND
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

// Format date Vietnamese
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

// Format datetime
function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString("vi-VN");
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Capitalize first letter
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Truncate text with ellipsis
function truncate(str, length = 50) {
  if (!str || str.length <= length) return str;
  return str.substring(0, length) + "...";
}

// Check if email is valid
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Check if phone number is valid (Vietnam)
function isValidPhone(phone) {
  const regex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
  return regex.test(phone);
}

// Get relative time (e.g., "2 hours ago")
function getRelativeTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return minutes + " phút trước";
  if (hours < 24) return hours + " giờ trước";
  if (days < 30) return days + " ngày trước";
  return formatDate(dateStr);
}

// Deep clone object
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Check if object is empty
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
