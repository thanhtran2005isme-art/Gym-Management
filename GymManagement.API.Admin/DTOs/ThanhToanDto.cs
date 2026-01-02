namespace GymManagement.API.Admin.DTOs
{
    public class ThanhToanDto
    {
        public int MaThanhToan { get; set; }
        public int MaHoaDon { get; set; }
        public decimal SoTien { get; set; }
        public DateTime NgayThanhToan { get; set; }
        public string HinhThuc { get; set; } = string.Empty;
        public string? GhiChu { get; set; }
    }

    public class CreateThanhToanDto
    {
        public int MaHoaDon { get; set; }
        public decimal SoTien { get; set; }
        public string HinhThuc { get; set; } = string.Empty;
        public string? GhiChu { get; set; }
    }
}
