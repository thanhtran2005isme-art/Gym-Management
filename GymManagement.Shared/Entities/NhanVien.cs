using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymManagement.Shared.Entities
{
    [Table("NhanVien", Schema = "dbo")]
    public class NhanVien
    {
        [Key]
        public int MaNhanVien { get; set; }
        public string HoTen { get; set; } = null!;
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public int? MaChucVu { get; set; }
        public DateTime? NgayVaoLam { get; set; }
        public bool TrangThai { get; set; } = true;

        [ForeignKey("MaChucVu")]
        public virtual ChucVu? ChucVu { get; set; }
    }
}
