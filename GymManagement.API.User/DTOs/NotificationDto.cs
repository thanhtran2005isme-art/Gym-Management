namespace GymManagement.API.User.DTOs;

// Thông báo
public class NotificationDto
{
    public int MaThongBao { get; set; }
    public string TieuDe { get; set; } = string.Empty;
    public string NoiDung { get; set; } = string.Empty;
    public DateTime NgayTao { get; set; }
    public bool DaDoc { get; set; }
    public string? LoaiThongBao { get; set; }
}
