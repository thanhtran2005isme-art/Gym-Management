using System.ComponentModel.DataAnnotations;

namespace MyWebAPI.Models.Entities
{
    public class ChiTietHoaDon
    {
        [Key]
        public int MaChiTiet { get; set; }
        public int MaHoaDon { get; set; }
        public string LoaiSanPham { get; set; } = null!;
        public int MaThamChieu { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
        public decimal ThanhTien { get; set; }
    }
}
