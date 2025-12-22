namespace GymManagement.Shared.DTOs
{
    public class NhanVienDto
    {
        public int MaNhanVien { get; set; }
        public string HoTen { get; set; } = null!;
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public int? MaChucVu { get; set; }
        public string? TenChucVu { get; set; }
        public DateTime? NgayVaoLam { get; set; }
        public bool TrangThai { get; set; }
    }
}
