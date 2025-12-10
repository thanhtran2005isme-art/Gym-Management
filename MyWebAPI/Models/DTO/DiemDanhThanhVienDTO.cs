namespace MyWebAPI.Models.DTO
{
    public class DiemDanhThanhVienDto
    {
        public int MaDiemDanh { get; set; }
        public int MaThanhVien { get; set; }
        public DateTime ThoiGianVao { get; set; }
        public DateTime? ThoiGianRa { get; set; }
        public string? HinhThuc { get; set; }
        public string? GhiChu { get; set; }
    }
}
