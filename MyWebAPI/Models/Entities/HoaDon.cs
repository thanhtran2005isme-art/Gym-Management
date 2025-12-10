using System.ComponentModel.DataAnnotations;

namespace MyWebAPI.Models.Entities
{
    public class HoaDon
    {
        [Key]
        public int MaHoaDon { get; set; }
        public int? MaThanhVien { get; set; }
        public int MaNhanVienLap { get; set; }
        public DateTime NgayLap { get; set; }
        public decimal TongTien { get; set; }
        public decimal GiamGia { get; set; }
        public decimal SoTienThanhToan { get; set; }
        public string HinhThucThanhToan { get; set; } = null!;
        public byte TrangThai { get; set; }
        public string? GhiChu { get; set; }
    }
}
