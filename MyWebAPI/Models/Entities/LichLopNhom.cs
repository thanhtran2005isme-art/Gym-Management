using System.ComponentModel.DataAnnotations;

namespace MyWebAPI.Models.Entities
{
    public class LichLopNhom
    {
        [Key]
        public int MaLichLopNhom { get; set; }
        public int MaLopHoc { get; set; }
        public int MaPhong { get; set; }
        public int MaHuanLuyenVien { get; set; }
        public byte ThuTrongTuan { get; set; }
        public TimeSpan GioBatDau { get; set; }
        public TimeSpan GioKetThuc { get; set; }
        public int SoLuongToiDa { get; set; }
        public DateTime NgayBatDau { get; set; }
        public DateTime NgayKetThuc { get; set; }
        public byte TrangThai { get; set; }
    }
}
