using System.ComponentModel.DataAnnotations;

namespace MyWebAPI.Models.Entities
{
    public class BuoiTapPT
    {
        [Key]
        public int MaBuoiTapPT { get; set; }
        public int MaHopDongPT { get; set; }
        public DateTime ThoiGianBatDau { get; set; }
        public DateTime ThoiGianKetThuc { get; set; }
        public byte TrangThai { get; set; }
        public string? GhiChu { get; set; }
    }
}
