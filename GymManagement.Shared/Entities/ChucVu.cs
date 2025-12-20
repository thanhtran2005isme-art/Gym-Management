using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymManagement.Shared.Entities
{
    [Table("ChucVu", Schema = "dbo")]
    public class ChucVu
    {
        [Key]
        public int MaChucVu { get; set; }
        public string TenChucVu { get; set; } = null!;
        public string? MoTa { get; set; }
    }
}
