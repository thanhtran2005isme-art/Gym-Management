namespace GymManagement.API.Trainer.DTOs
{
    // DTO hiển thị thông báo
    public class ThongBaoDto
    {
        public int Id { get; set; }
        public string TieuDe { get; set; } = string.Empty;
        public string NoiDung { get; set; } = string.Empty;
        public string LoaiThongBao { get; set; } = string.Empty; // System, Schedule, Contract, Reminder
        public bool DaDoc { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime? NgayDoc { get; set; }
        public string Link { get; set; } = string.Empty; // Link đến trang liên quan
    }

    // DTO số thông báo chưa đọc
    public class UnreadCountDto
    {
        public int SoThongBaoChuaDoc { get; set; }
    }
}
