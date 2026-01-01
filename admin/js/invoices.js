// ===== Invoice Data =====
let invoices = JSON.parse(localStorage.getItem("gymInvoices")) || [];
let members = JSON.parse(localStorage.getItem("gymMembers")) || [];
let currentInvoiceId = null;

// Products/Services
const products = {
  membership: [
    { id: "pkg1", name: "Gói 1 tháng", price: 500000 },
    { id: "pkg2", name: "Gói 3 tháng", price: 1200000 },
    { id: "pkg3", name: "Gói 6 tháng", price: 2000000 },
    { id: "pkg4", name: "Gói 12 tháng", price: 3500000 },
  ],
  pt: [
    { id: "pt1", name: "PT 1 buổi", price: 300000 },
    { id: "pt5", name: "PT 5 buổi", price: 1400000 },
    { id: "pt10", name: "PT 10 buổi", price: 2500000 },
    { id: "pt20", name: "PT 20 buổi", price: 4500000 },
  ],
  product: [
    { id: "prd1", name: "Whey Protein 1kg", price: 800000 },
    { id: "prd2", name: "BCAA 300g", price: 450000 },
    { id: "prd3", name: "Găng tay tập", price: 150000 },
    { id: "prd4", name: "Dây kháng lực", price: 120000 },
    { id: "prd5", name: "Bình nước Gym", price: 80000 },
  ],
  other: [
    { id: "oth1", name: "Phí gửi đồ tháng", price: 100000 },
    { id: "oth2", name: "Khăn tập", price: 50000 },
    { id: "oth3", name: "Dịch vụ khác", price: 0 },
  ],
};

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", function () {
  if (!checkAuth()) return;

  if (members.length === 0) loadSampleMembers();
  if (invoices.length === 0) loadSampleInvoices();

  // Set default month filter
  const now = new Date();
  document.getElementById("filterMonth").value = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  initTheme();
  initSidebar();
  initEventListeners();
  populateCustomerSelect();
  renderInvoices();
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
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}

// ===== Populate Customer Select =====
function populateCustomerSelect() {
  const select = document.getElementById("invoiceCustomer");
  select.innerHTML = '<option value="">Chọn khách hàng</option>';

  members.forEach((m) => {
    const option = document.createElement("option");
    option.value = m.id;
    option.textContent = `${m.name} - ${m.cardId}`;
    select.appendChild(option);
  });
}

// ===== Update Invoice Items =====
function updateInvoiceItems() {
  const type = document.getElementById("invoiceType").value;
  const itemSelect = document.getElementById("invoiceItem");

  itemSelect.innerHTML = '<option value="">Chọn sản phẩm</option>';

  if (type && products[type]) {
    products[type].forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.name} - ${formatCurrency(item.price)}`;
      option.dataset.price = item.price;
      option.dataset.name = item.name;
      itemSelect.appendChild(option);
    });
  }

  updateAmount();
}

// ===== Update Amount =====
function updateAmount() {
  const itemSelect = document.getElementById("invoiceItem");
  const quantity =
    parseInt(document.getElementById("invoiceQuantity").value) || 1;
  const discount =
    parseInt(document.getElementById("invoiceDiscount").value) || 0;

  const selectedOption = itemSelect.options[itemSelect.selectedIndex];
  const unitPrice = parseInt(selectedOption?.dataset?.price) || 0;

  const subtotal = unitPrice * quantity;
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;

  document.getElementById("invoiceUnitPrice").value = formatCurrency(unitPrice);
  document.getElementById("invoiceAmount").value = formatCurrency(subtotal);
  document.getElementById("invoiceTotal").value = formatCurrency(total);
}

// ===== Render Invoices =====
function renderInvoices() {
  const tbody = document.getElementById("invoicesTableBody");
  const statusFilter = document.getElementById("filterStatus").value;
  const typeFilter = document.getElementById("filterType").value;
  const monthFilter = document.getElementById("filterMonth").value;

  let filtered = [...invoices];

  if (statusFilter !== "all") {
    filtered = filtered.filter((i) => i.status === statusFilter);
  }

  if (typeFilter !== "all") {
    filtered = filtered.filter((i) => i.type === typeFilter);
  }

  if (monthFilter) {
    filtered = filtered.filter((i) => i.createdAt.startsWith(monthFilter));
  }

  // Sort by date desc
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-invoices">
            <i class="fas fa-file-invoice"></i>
            <h3>Chưa có hóa đơn</h3>
            <p>Nhấn "Tạo hóa đơn" để thêm mới</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered
    .map((invoice) => createInvoiceRow(invoice))
    .join("");
}

function createInvoiceRow(invoice) {
  const member = members.find((m) => m.id === invoice.customerId);
  const avatarBg = member?.gender === "male" ? "3b82f6" : "ec4899";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    invoice.customerName
  )}&background=${avatarBg}&color=fff`;

  return `
    <tr>
      <td><span class="invoice-id">${invoice.invoiceId}</span></td>
      <td>
        <div class="customer-cell">
          <img src="${avatarUrl}" alt="${invoice.customerName}" />
          <div class="customer-info">
            <span class="customer-name">${invoice.customerName}</span>
            <span class="customer-phone">${invoice.customerPhone || ""}</span>
          </div>
        </div>
      </td>
      <td><span class="type-badge ${invoice.type}">${getTypeName(
    invoice.type
  )}</span></td>
      <td>${invoice.description}</td>
      <td><span class="amount">${formatCurrency(invoice.total)}</span></td>
      <td>${formatDate(invoice.createdAt)}</td>
      <td><span class="invoice-status ${invoice.status}">${getStatusName(
    invoice.status
  )}</span></td>
      <td>
        <div class="action-buttons">
          <button class="action-btn edit" onclick="viewInvoice(${
            invoice.id
          })" title="Xem">
            <i class="fas fa-eye"></i>
          </button>
          ${
            invoice.status === "pending"
              ? `
          <button class="action-btn renew" onclick="markAsPaid(${invoice.id})" title="Thanh toán">
            <i class="fas fa-check"></i>
          </button>
          `
              : ""
          }
          <button class="action-btn delete" onclick="deleteInvoice(${
            invoice.id
          })" title="Xóa">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

// ===== Filter Invoices =====
function filterInvoices() {
  renderInvoices();
}

// ===== Search =====
function handleSearch(e) {
  const term = e.target.value.toLowerCase().trim();

  if (!term) {
    renderInvoices();
    return;
  }

  const filtered = invoices.filter(
    (i) =>
      i.invoiceId.toLowerCase().includes(term) ||
      i.customerName.toLowerCase().includes(term) ||
      i.description.toLowerCase().includes(term)
  );

  const tbody = document.getElementById("invoicesTableBody");

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-invoices">
            <i class="fas fa-search"></i>
            <h3>Không tìm thấy kết quả</h3>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered
    .map((invoice) => createInvoiceRow(invoice))
    .join("");
}

// ===== Update Stats =====
function updateStats() {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  const monthlyInvoices = invoices.filter((i) =>
    i.createdAt.startsWith(currentMonth)
  );
  const paidMonthly = monthlyInvoices.filter((i) => i.status === "paid");
  const revenue = paidMonthly.reduce((sum, i) => sum + i.total, 0);

  document.getElementById("totalInvoices").textContent = invoices.length;
  document.getElementById("paidInvoices").textContent = invoices.filter(
    (i) => i.status === "paid"
  ).length;
  document.getElementById("pendingInvoices").textContent = invoices.filter(
    (i) => i.status === "pending"
  ).length;
  document.getElementById("monthlyRevenue").textContent =
    formatCurrencyShort(revenue);
}

// ===== Modal Functions =====
function openModal(modalId) {
  document.getElementById(modalId).classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
  document.body.style.overflow = "";

  if (modalId === "addInvoiceModal") {
    document.getElementById("addInvoiceForm").reset();
    document.getElementById("invoiceItem").innerHTML =
      '<option value="">Chọn sản phẩm</option>';
  }
}

// ===== Add Invoice =====
function addInvoice(event) {
  event.preventDefault();

  const customerId = parseInt(document.getElementById("invoiceCustomer").value);
  const type = document.getElementById("invoiceType").value;
  const itemSelect = document.getElementById("invoiceItem");
  const selectedOption = itemSelect.options[itemSelect.selectedIndex];
  const quantity =
    parseInt(document.getElementById("invoiceQuantity").value) || 1;
  const discount =
    parseInt(document.getElementById("invoiceDiscount").value) || 0;
  const paymentMethod = document.getElementById("paymentMethod").value;
  const status = document.getElementById("invoiceStatus").value;
  const note = document.getElementById("invoiceNote").value.trim();

  if (!customerId || !type || !selectedOption?.value) {
    showToast("Vui lòng điền đầy đủ thông tin!", "error");
    return;
  }

  const member = members.find((m) => m.id === customerId);
  const unitPrice = parseInt(selectedOption.dataset.price) || 0;
  const subtotal = unitPrice * quantity;
  const total = subtotal - (subtotal * discount) / 100;

  const newInvoice = {
    id: Date.now(),
    invoiceId: generateInvoiceId(),
    customerId,
    customerName: member?.name || "Khách lẻ",
    customerPhone: member?.phone || "",
    type,
    itemId: selectedOption.value,
    itemName: selectedOption.dataset.name,
    description: `${selectedOption.dataset.name}${
      quantity > 1 ? ` x${quantity}` : ""
    }`,
    quantity,
    unitPrice,
    subtotal,
    discount,
    total,
    paymentMethod,
    status,
    note,
    createdAt: new Date().toISOString(),
  };

  invoices.push(newInvoice);
  saveInvoices();

  closeModal("addInvoiceModal");
  renderInvoices();
  updateStats();
  showToast("Đã tạo hóa đơn thành công!", "success");
}

// ===== View Invoice =====
function viewInvoice(id) {
  const invoice = invoices.find((i) => i.id === id);
  if (!invoice) return;

  currentInvoiceId = id;

  document.getElementById("invoicePreview").innerHTML = `
    <div class="invoice-header">
      <div class="invoice-brand">
        <div class="invoice-brand-icon">
          <i class="fas fa-dumbbell"></i>
        </div>
        <div>
          <h3>FitZone Gym</h3>
          <p>Gym Management System</p>
        </div>
      </div>
      <div class="invoice-meta">
        <h4>HÓA ĐƠN</h4>
        <div class="invoice-number">${invoice.invoiceId}</div>
        <div class="invoice-date">Ngày: ${formatDate(invoice.createdAt)}</div>
      </div>
    </div>
    
    <div class="invoice-parties">
      <div class="invoice-party">
        <h5>Từ</h5>
        <p>
          <strong>FitZone Gym</strong>
          123 Đường ABC, Quận XYZ<br>
          TP. Hồ Chí Minh<br>
          Tel: 0123 456 789
        </p>
      </div>
      <div class="invoice-party">
        <h5>Đến</h5>
        <p>
          <strong>${invoice.customerName}</strong>
          ${invoice.customerPhone ? `Tel: ${invoice.customerPhone}` : ""}
        </p>
      </div>
    </div>
    
    <div class="invoice-items">
      <table>
        <thead>
          <tr>
            <th>Mô tả</th>
            <th class="text-right">Số lượng</th>
            <th class="text-right">Đơn giá</th>
            <th class="text-right">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${invoice.itemName}</td>
            <td class="text-right">${invoice.quantity}</td>
            <td class="text-right">${formatCurrency(invoice.unitPrice)}</td>
            <td class="text-right">${formatCurrency(invoice.subtotal)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="invoice-summary">
      <div class="invoice-summary-table">
        <div class="invoice-summary-row">
          <span>Tạm tính</span>
          <span>${formatCurrency(invoice.subtotal)}</span>
        </div>
        <div class="invoice-summary-row">
          <span>Giảm giá (${invoice.discount}%)</span>
          <span>-${formatCurrency(
            (invoice.subtotal * invoice.discount) / 100
          )}</span>
        </div>
        <div class="invoice-summary-row total">
          <span>Tổng cộng</span>
          <span>${formatCurrency(invoice.total)}</span>
        </div>
      </div>
    </div>
    
    <div class="invoice-footer">
      <p>Phương thức: ${getPaymentMethodName(
        invoice.paymentMethod
      )} | Trạng thái: ${getStatusName(invoice.status)}</p>
      <p>Cảm ơn quý khách đã sử dụng dịch vụ của FitZone!</p>
    </div>
  `;

  openModal("viewInvoiceModal");
}

// ===== Mark as Paid =====
function markAsPaid(id) {
  const invoice = invoices.find((i) => i.id === id);
  if (!invoice) return;

  if (confirm("Xác nhận đã thanh toán hóa đơn này?")) {
    invoice.status = "paid";
    invoice.paidAt = new Date().toISOString();
    saveInvoices();
    renderInvoices();
    updateStats();
    showToast("Đã cập nhật trạng thái thanh toán!", "success");
  }
}

// ===== Delete Invoice =====
function deleteInvoice(id) {
  if (confirm("Bạn có chắc muốn xóa hóa đơn này?")) {
    invoices = invoices.filter((i) => i.id !== id);
    saveInvoices();
    renderInvoices();
    updateStats();
    showToast("Đã xóa hóa đơn!", "success");
  }
}

// ===== Print Invoice =====
function printInvoice() {
  const content = document.getElementById("invoicePreview").innerHTML;
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>In hóa đơn</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .invoice-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .invoice-brand { display: flex; align-items: center; gap: 12px; }
          .invoice-brand-icon { width: 50px; height: 50px; background: #6366f1; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; }
          .invoice-meta { text-align: right; }
          .invoice-number { font-size: 20px; font-weight: bold; color: #6366f1; }
          .invoice-parties { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
          .invoice-party h5 { color: #666; text-transform: uppercase; font-size: 12px; margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f5f5f5; }
          .text-right { text-align: right; }
          .invoice-summary { display: flex; justify-content: flex-end; }
          .invoice-summary-table { width: 300px; }
          .invoice-summary-row { display: flex; justify-content: space-between; padding: 8px 0; }
          .invoice-summary-row.total { font-weight: bold; font-size: 18px; color: #6366f1; }
          .invoice-footer { margin-top: 30px; text-align: center; color: #666; }
        </style>
      </head>
      <body>${content}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// ===== Export Invoices =====
function exportInvoices() {
  showToast("Tính năng xuất Excel đang phát triển", "error");
}

// ===== Helper Functions =====
function generateInvoiceId() {
  const date = new Date();
  const prefix = "INV";
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(date.getDate()).padStart(2, "0")}`;
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}${dateStr}${random}`;
}

function getTypeName(type) {
  const types = {
    membership: "Gói tập",
    pt: "PT",
    product: "Sản phẩm",
    other: "Khác",
  };
  return types[type] || type;
}

function getStatusName(status) {
  const statuses = {
    paid: "Đã thanh toán",
    pending: "Chờ thanh toán",
    cancelled: "Đã hủy",
  };
  return statuses[status] || status;
}

function getPaymentMethodName(method) {
  const methods = { cash: "Tiền mặt", transfer: "Chuyển khoản", card: "Thẻ" };
  return methods[method] || method;
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

// ===== Save/Load =====
function saveInvoices() {
  localStorage.setItem("gymInvoices", JSON.stringify(invoices));
}

// ===== Sample Data =====
function loadSampleMembers() {
  members = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      cardId: "GYM001",
      phone: "0901234567",
      gender: "male",
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      cardId: "GYM002",
      phone: "0912345678",
      gender: "female",
    },
    {
      id: 3,
      name: "Lê Minh Cường",
      cardId: "GYM003",
      phone: "0923456789",
      gender: "male",
    },
    {
      id: 4,
      name: "Phạm Thu Dung",
      cardId: "GYM004",
      phone: "0934567890",
      gender: "female",
    },
    {
      id: 5,
      name: "Hoàng Văn Em",
      cardId: "GYM005",
      phone: "0945678901",
      gender: "male",
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
      customerPhone: "0901234567",
      type: "membership",
      itemId: "pkg4",
      itemName: "Gói 12 tháng",
      description: "Gói 12 tháng",
      quantity: 1,
      unitPrice: 3500000,
      subtotal: 3500000,
      discount: 0,
      total: 3500000,
      paymentMethod: "transfer",
      status: "paid",
      createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
    },
    {
      id: 2,
      invoiceId: "INV202412002",
      customerId: 2,
      customerName: "Trần Thị Bình",
      customerPhone: "0912345678",
      type: "membership",
      itemId: "pkg3",
      itemName: "Gói 6 tháng",
      description: "Gói 6 tháng",
      quantity: 1,
      unitPrice: 2000000,
      subtotal: 2000000,
      discount: 10,
      total: 1800000,
      paymentMethod: "cash",
      status: "paid",
      createdAt: new Date(now.getFullYear(), now.getMonth(), 3).toISOString(),
    },
    {
      id: 3,
      invoiceId: "INV202412003",
      customerId: 3,
      customerName: "Lê Minh Cường",
      customerPhone: "0923456789",
      type: "pt",
      itemId: "pt10",
      itemName: "PT 10 buổi",
      description: "PT 10 buổi",
      quantity: 1,
      unitPrice: 2500000,
      subtotal: 2500000,
      discount: 0,
      total: 2500000,
      paymentMethod: "card",
      status: "paid",
      createdAt: new Date(now.getFullYear(), now.getMonth(), 5).toISOString(),
    },
    {
      id: 4,
      invoiceId: "INV202412004",
      customerId: 4,
      customerName: "Phạm Thu Dung",
      customerPhone: "0934567890",
      type: "product",
      itemId: "prd1",
      itemName: "Whey Protein 1kg",
      description: "Whey Protein 1kg x2",
      quantity: 2,
      unitPrice: 800000,
      subtotal: 1600000,
      discount: 5,
      total: 1520000,
      paymentMethod: "cash",
      status: "paid",
      createdAt: new Date(now.getFullYear(), now.getMonth(), 10).toISOString(),
    },
    {
      id: 5,
      invoiceId: "INV202412005",
      customerId: 5,
      customerName: "Hoàng Văn Em",
      customerPhone: "0945678901",
      type: "membership",
      itemId: "pkg2",
      itemName: "Gói 3 tháng",
      description: "Gói 3 tháng",
      quantity: 1,
      unitPrice: 1200000,
      subtotal: 1200000,
      discount: 0,
      total: 1200000,
      paymentMethod: "transfer",
      status: "pending",
      createdAt: new Date(now.getFullYear(), now.getMonth(), 15).toISOString(),
    },
    {
      id: 6,
      invoiceId: "INV202412006",
      customerId: 1,
      customerName: "Nguyễn Văn An",
      customerPhone: "0901234567",
      type: "product",
      itemId: "prd3",
      itemName: "Găng tay tập",
      description: "Găng tay tập",
      quantity: 1,
      unitPrice: 150000,
      subtotal: 150000,
      discount: 0,
      total: 150000,
      paymentMethod: "cash",
      status: "paid",
      createdAt: new Date(now.getFullYear(), now.getMonth(), 18).toISOString(),
    },
  ];
  saveInvoices();
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
