using System.ComponentModel.DataAnnotations;

namespace MyWebAPI.Models.Entities
{
    public class VaiTro
    {
        [Key]
        public int MaVaiTro { get; set; }
        public string TenVaiTro { get; set; } = null!;
        public string? MoTa { get; set; }
    }
}
