namespace GymManagement.Shared.DTOs
{
    public class CheckInDto
    {
        public int MaCheckIn { get; set; }
        public int MaThanhVien { get; set; }
        public string? TenThanhVien { get; set; }
        public DateTime ThoiGianVao { get; set; }
        public DateTime? ThoiGianRa { get; set; }
    }

    public class CheckInRequest
    {
        public int MaThanhVien { get; set; }
    }

    public class CheckOutRequest
    {
        public int MaCheckIn { get; set; }
    }
}
