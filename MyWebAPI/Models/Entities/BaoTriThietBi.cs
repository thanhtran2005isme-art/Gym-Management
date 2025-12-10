using System.ComponentModel.DataAnnotations;

namespace MyWebAPI.Models.Entities
{
    public class BaoTriThietBi
    {
        [Key]
        public int MaBaoTri { get; set; }
        public int MaThietBi { get; set; }
        public DateTime NgayBaoTri { get; set; }
        public string? NoiDung { get; set; }
        public decimal? ChiPhi { get; set; }
        public int? MaNhanVienPhuTrach { get; set; }
        public string? GhiChu { get; set; }
    }
}
