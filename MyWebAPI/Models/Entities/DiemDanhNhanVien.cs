using System.ComponentModel.DataAnnotations;

namespace MyWebAPI.Models.Entities
{
    public class DiemDanhNhanVien
    {
        [Key]
        public int MaDiemDanhNV { get; set; }
        public int MaNhanVien { get; set; }
        public DateTime ThoiGianVao { get; set; }
        public DateTime? ThoiGianRa { get; set; }
        public string? GhiChu { get; set; }
    }
}
