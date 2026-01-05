namespace GymManagement.API.Admin.DTOs
{
    public class HoaDonDto
    {
        public int MaHoaDon { get; set; }
        public int? MaThanhVien { get; set; }
        public string? TenThanhVien { get; set; }
        public int MaNhanVienLap { get; set; }
        public string? TenNhanVienLap { get; set; }
        public DateTime NgayLap { get; set; }
        public decimal TongTien { get; set; }
        public decimal GiamGia { get; set; }
        public decimal SoTienPhaiTra { get; set; }
        public byte TrangThai { get; set; }
        public string? GhiChu { get; set; }
        public List<ChiTietHoaDonDto>? ChiTietHoaDon { get; set; }
    }

    public class ChiTietHoaDonDto
    {
        public int MaChiTiet { get; set; }
        public int MaHoaDon { get; set; }
        public string LoaiSanPham { get; set; } = string.Empty;
        public int MaThamChieu { get; set; }
        public string? TenSanPham { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
        public decimal ThanhTien { get; set; }
    }

    public class CreateHoaDonDto
    {
        public int? MaThanhVien { get; set; }
        public int MaNhanVienLap { get; set; }
        public decimal GiamGia { get; set; }
        public string? GhiChu { get; set; }
        public List<CreateChiTietHoaDonDto> ChiTietHoaDon { get; set; } = new();
    }

    public class CreateChiTietHoaDonDto
    {
        public string LoaiSanPham { get; set; } = string.Empty;
        public int MaThamChieu { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
    }

    public class UpdateHoaDonDto
    {
        public byte TrangThai { get; set; }
        public string? GhiChu { get; set; }
    }
}
