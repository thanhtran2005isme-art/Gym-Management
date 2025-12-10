using System.ComponentModel.DataAnnotations;

namespace MyWebAPI.Models.Entities
{
    public class NhanVien
    {
        [Key]
        public int MaNhanVien { get; set; }
        public string HoTen { get; set; } = null!;
        public DateTime? NgaySinh { get; set; }
        public string? GioiTinh { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public string? DiaChi { get; set; }
        public DateTime NgayVaoLam { get; set; }
        public int? MaChucVu { get; set; }
        public byte TrangThai { get; set; }
        public string? GhiChu { get; set; }
    }
}
