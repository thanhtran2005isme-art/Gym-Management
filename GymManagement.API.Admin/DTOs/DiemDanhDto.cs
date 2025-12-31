namespace GymManagement.API.Admin.DTOs
{
    public class DiemDanhDto
    {
        public int MaDiemDanh { get; set; }
        public int MaThanhVien { get; set; }
        public string? TenThanhVien { get; set; }
        public string? MaThe { get; set; }
        public DateTime ThoiGianVao { get; set; }
        public DateTime? ThoiGianRa { get; set; }
        public string? HinhThuc { get; set; }
        public string? GhiChu { get; set; }
    }

    public class CreateDiemDanhDto
    {
        public int MaThanhVien { get; set; }
        public string? HinhThuc { get; set; }
        public string? GhiChu { get; set; }
    }

    public class CheckOutDto
    {
        public DateTime? ThoiGianRa { get; set; }
        public string? GhiChu { get; set; }
    }

    public class DiemDanhThongKeDto
    {
        public DateTime Ngay { get; set; }
        public int SoLuotCheckIn { get; set; }
        public int SoThanhVienDangTap { get; set; }
    }
}
