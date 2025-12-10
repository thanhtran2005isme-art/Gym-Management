namespace MyWebAPI.Models.DTO
{
    public class HuanLuyenVienDto
    {
        public int MaHuanLuyenVien { get; set; }
        public int MaNhanVien { get; set; }
        public string? ChuyenMon { get; set; }
        public string? MoTa { get; set; }
        public decimal? MucLuongCoBan { get; set; }
        public decimal? TiLeHoaHongPT { get; set; }
    }
}
