namespace MyWebAPI.Models.DTO
{
    public class TaiKhoanDto
    {
        public int MaTaiKhoan { get; set; }
        public string TenDangNhap { get; set; } = null!;
        public int MaVaiTro { get; set; }
        public int? MaNhanVien { get; set; }
        public int? MaThanhVien { get; set; }
        public byte TrangThai { get; set; }
        public DateTime NgayTao { get; set; }
    }
}
