namespace GymManagement.Shared.DTOs
{
    public class DangKyGoiTapDto
    {
        public int MaDangKy { get; set; }
        public int MaThanhVien { get; set; }
        public string? TenThanhVien { get; set; }
        public int MaGoiTap { get; set; }
        public string? TenGoiTap { get; set; }
        public DateTime NgayBatDau { get; set; }
        public DateTime NgayKetThuc { get; set; }
        public string TrangThai { get; set; } = null!;
    }

    public class DangKyGoiTapRequest
    {
        public int MaThanhVien { get; set; }
        public int MaGoiTap { get; set; }
    }
}
