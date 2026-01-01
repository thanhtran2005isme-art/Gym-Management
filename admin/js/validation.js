// ===== Form Validation =====

const Validation = {
  isEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  isPhone(phone) {
    return /^[0-9]{10,11}$/.test(phone.replace(/\s/g, ""));
  },

  isRequired(value) {
    return value !== null && value !== undefined && value.trim() !== "";
  },

  minLength(value, min) {
    return value.length >= min;
  },

  maxLength(value, max) {
    return value.length <= max;
  },
};
