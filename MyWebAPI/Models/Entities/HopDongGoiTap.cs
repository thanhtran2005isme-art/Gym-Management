using System.ComponentModel.DataAnnotations;

namespace MyWebAPI.Models.Entities
{
    public class HopDongGoiTap
    {
        [Key]
        public int MaHopDongGoiTap { get; set; }
        public int MaThanhVien { get; set; }
        public int MaGoiTap { get; set; }
        public DateTime NgayBatDau { get; set; }
        public DateTime NgayKetThuc { get; set; }
        public decimal TongTien { get; set; }
        public decimal SoTienGiam { get; set; }
        public decimal SoTienPhaiTra { get; set; }
        public byte TrangThai { get; set; }
        public DateTime NgayTao { get; set; }
        public int? MaNhanVienTao { get; set; }
    }
}
