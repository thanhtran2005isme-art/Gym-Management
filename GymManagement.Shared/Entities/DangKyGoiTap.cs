using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymManagement.Shared.Entities
{
    [Table("DangKyGoiTap", Schema = "dbo")]
    public class DangKyGoiTap
    {
        [Key]
        public int MaDangKy { get; set; }
        public int MaThanhVien { get; set; }
        public int MaGoiTap { get; set; }
        public DateTime NgayBatDau { get; set; }
        public DateTime NgayKetThuc { get; set; }
        public string TrangThai { get; set; } = "HoatDong"; // HoatDong, HetHan, HuyBo

        [ForeignKey("MaThanhVien")]
        public virtual ThanhVien? ThanhVien { get; set; }

        [ForeignKey("MaGoiTap")]
        public virtual GoiTap? GoiTap { get; set; }
    }
}
