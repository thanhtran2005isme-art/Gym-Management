using System.ComponentModel.DataAnnotations;

namespace MyWebAPI.Models.Entities
{
    public class GoiTap
    {
        [Key]
        public int MaGoiTap { get; set; }
        public string TenGoiTap { get; set; } = null!;
        public int SoThang { get; set; }
        public int? SoLanTapToiDa { get; set; }
        public decimal Gia { get; set; }
        public string? MoTa { get; set; }
        public byte TrangThai { get; set; }
    }
}
