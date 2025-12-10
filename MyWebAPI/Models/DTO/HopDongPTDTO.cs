namespace MyWebAPI.Models.DTO
{
    public class HopDongPTDto
    {
        public int MaHopDongPT { get; set; }
        public int MaThanhVien { get; set; }
        public int MaHuanLuyenVien { get; set; }
        public int MaGoiPT { get; set; }
        public DateTime NgayBatDau { get; set; }
        public DateTime NgayKetThuc { get; set; }
        public decimal TongTien { get; set; }
        public decimal SoTienGiam { get; set; }
        public decimal SoTienPhaiTra { get; set; }
        public byte TrangThai { get; set; }
        public DateTime NgayTao { get; set; }
        public int? MaNhanVienTao { get; set; }
    }
}
