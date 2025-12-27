// ===== Constants =====

const MEMBER_STATUS = {
  ACTIVE: "active",
  EXPIRING: "expiring",
  EXPIRED: "expired",
};

const PACKAGE_TYPES = {
  MONTHLY: { id: 1, name: "Gói 1 tháng", duration: 30, price: 500000 },
  QUARTERLY: { id: 2, name: "Gói 3 tháng", duration: 90, price: 1200000 },
  BIANNUAL: { id: 3, name: "Gói 6 tháng", duration: 180, price: 2000000 },
  ANNUAL: { id: 4, name: "Gói 12 tháng", duration: 365, price: 3500000 },
};

const EQUIPMENT_CATEGORIES = {
  CARDIO: "cardio",
  STRENGTH: "strength",
  FREE_WEIGHT: "free-weight",
  ACCESSORIES: "accessories",
};

const INVOICE_STATUS = {
  PAID: "paid",
  PENDING: "pending",
  CANCELLED: "cancelled",
};
