namespace MyWebAPI.Models.DTO
{
    public class DangKyLopNhomDto
    {
        public int MaDangKy { get; set; }
        public int MaThanhVien { get; set; }
        public int MaLichLopNhom { get; set; }
        public DateTime NgayDangKy { get; set; }
        public byte TrangThai { get; set; }
        public string? GhiChu { get; set; }
    }
}
