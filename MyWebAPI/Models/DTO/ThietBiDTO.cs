namespace MyWebAPI.Models.DTO
{
    public class ThietBiDto
    {
        public int MaThietBi { get; set; }
        public string TenThietBi { get; set; } = null!;
        public int? MaPhong { get; set; }
        public string? HangSanXuat { get; set; }
        public DateTime? NgayMua { get; set; }
        public decimal? GiaMua { get; set; }
        public string? TrangThai { get; set; }
        public string? MoTa { get; set; }
    }
}
