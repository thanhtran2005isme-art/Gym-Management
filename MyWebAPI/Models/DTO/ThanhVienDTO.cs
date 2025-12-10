namespace MyWebAPI.Models.DTO
{
    public class ThanhVienDto
    {
        public int MaThanhVien { get; set; }
        public string? MaThe { get; set; }
        public string HoTen { get; set; } = null!;
        public DateTime? NgaySinh { get; set; }
        public string? GioiTinh { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public string? DiaChi { get; set; }
        public DateTime NgayDangKy { get; set; }
        public byte TrangThai { get; set; }
        public string? GhiChu { get; set; }
    }
}
