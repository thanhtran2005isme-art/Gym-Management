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
