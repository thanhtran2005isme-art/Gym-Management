using System.ComponentModel.DataAnnotations;

namespace MyWebAPI.Models.Entities
{
    public class ChucVu
    {
        [Key]
        public int MaChucVu { get; set; }
        public string TenChucVu { get; set; } = null!;
        public string? MoTa { get; set; }
    }
}
