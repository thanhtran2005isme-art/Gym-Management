namespace MyWebAPI.Models.DTO
{
    public class BuoiTapPTDto
    {
        public int MaBuoiTapPT { get; set; }
        public int MaHopDongPT { get; set; }
        public DateTime ThoiGianBatDau { get; set; }
        public DateTime ThoiGianKetThuc { get; set; }
        public byte TrangThai { get; set; }
        public string? GhiChu { get; set; }
    }
}
