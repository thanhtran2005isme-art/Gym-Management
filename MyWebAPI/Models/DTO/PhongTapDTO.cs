namespace MyWebAPI.Models.DTO
{
    public class PhongTapDto
    {
        public int MaPhong { get; set; }
        public string TenPhong { get; set; } = null!;
        public int? SucChua { get; set; }
        public string? MoTa { get; set; }
        public byte TrangThai { get; set; }
    }
}
