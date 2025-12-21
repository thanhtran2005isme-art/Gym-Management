namespace GymManagement.Shared.DTOs
{
    public class ThanhVienDto
    {
        public int MaThanhVien { get; set; }
        public string HoTen { get; set; } = null!;
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string? GioiTinh { get; set; }
        public string? DiaChi { get; set; }
        public DateTime NgayDangKy { get; set; }
        public bool TrangThai { get; set; }
    }
}
