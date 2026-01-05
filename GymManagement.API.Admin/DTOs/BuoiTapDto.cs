namespace GymManagement.API.Admin.DTOs
{
    public class BuoiTapDto
    {
        public int MaBuoiTap { get; set; }
        public int MaThanhVien { get; set; }
        public string? TenThanhVien { get; set; }
        public int? MaHopDong { get; set; }
        public DateTime NgayTap { get; set; }
        public DateTime? ThoiGianBatDau { get; set; }
        public DateTime? ThoiGianKetThuc { get; set; }
        public string? GhiChu { get; set; }
    }

    public class CreateBuoiTapDto
    {
        public int MaThanhVien { get; set; }
        public int? MaHopDong { get; set; }
        public DateTime NgayTap { get; set; }
        public DateTime? ThoiGianBatDau { get; set; }
        public DateTime? ThoiGianKetThuc { get; set; }
        public string? GhiChu { get; set; }
    }

    public class UpdateBuoiTapDto
    {
        public int? MaHopDong { get; set; }
        public DateTime? NgayTap { get; set; }
        public DateTime? ThoiGianBatDau { get; set; }
        public DateTime? ThoiGianKetThuc { get; set; }
        public string? GhiChu { get; set; }
    }
}
