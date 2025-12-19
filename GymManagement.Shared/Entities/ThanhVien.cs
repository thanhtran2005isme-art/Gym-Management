using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymManagement.Shared.Entities
{
    [Table("ThanhVien", Schema = "dbo")]
    public class ThanhVien
    {
        [Key]
        public int MaThanhVien { get; set; }
        public string HoTen { get; set; } = null!;
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string? GioiTinh { get; set; }
        public string? DiaChi { get; set; }
        public DateTime NgayDangKy { get; set; } = DateTime.Now;
        public bool TrangThai { get; set; } = true;
    }
}
