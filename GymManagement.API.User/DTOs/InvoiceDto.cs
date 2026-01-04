namespace GymManagement.API.User.DTOs;

// Danh sách hóa đơn
public class InvoiceDto
{
    public int MaHoaDon { get; set; }
    public DateTime NgayLap { get; set; }
    public decimal TongTien { get; set; }
    public decimal GiamGia { get; set; }
    public decimal SoTienThanhToan { get; set; }
    public string HinhThucThanhToan { get; set; } = string.Empty;
    public int TrangThai { get; set; }
    public string? TrangThaiText { get; set; }
}

// Chi tiết hóa đơn
public class InvoiceDetailDto : InvoiceDto
{
    public string? TenNhanVienLap { get; set; }
    public string? GhiChu { get; set; }
    public List<InvoiceItemDto> ChiTiet { get; set; } = new();
}

// Chi tiết từng mục trong hóa đơn
public class InvoiceItemDto
{
    public int MaChiTiet { get; set; }
    public string LoaiSanPham { get; set; } = string.Empty;
    public string TenSanPham { get; set; } = string.Empty;
    public int SoLuong { get; set; }
    public decimal DonGia { get; set; }
    public decimal ThanhTien { get; set; }
}

// Lịch sử thanh toán
public class PaymentHistoryDto
{
    public int MaHoaDon { get; set; }
    public DateTime NgayThanhToan { get; set; }
    public decimal SoTien { get; set; }
    public string HinhThuc { get; set; } = string.Empty;
}
