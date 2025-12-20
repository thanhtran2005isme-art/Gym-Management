using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymManagement.Shared.Entities
{
    [Table("CheckIn", Schema = "dbo")]
    public class CheckIn
    {
        [Key]
        public int MaCheckIn { get; set; }
        public int MaThanhVien { get; set; }
        public DateTime ThoiGianVao { get; set; } = DateTime.Now;
        public DateTime? ThoiGianRa { get; set; }

        [ForeignKey("MaThanhVien")]
        public virtual ThanhVien? ThanhVien { get; set; }
    }
}
