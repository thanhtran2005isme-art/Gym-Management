namespace GymManagement.API.User.DTOs;

// Lịch sử check-in
public class CheckinDto
{
    public int MaDiemDanh { get; set; }
    public DateTime ThoiGianVao { get; set; }
    public DateTime? ThoiGianRa { get; set; }
    public string? HinhThuc { get; set; }
    public string? GhiChu { get; set; }
    public int? ThoiGianTapPhut { get; set; }
}

// Thống kê check-in
public class CheckinStatsDto
{
    public int Thang { get; set; }
    public int Nam { get; set; }
    public int TongSoLanCheckin { get; set; }
    public int TongThoiGianTapPhut { get; set; }
    public double TrungBinhThoiGianPhut { get; set; }
}

// Lịch sử buổi tập
public class SessionDto
{
    public int MaDiemDanh { get; set; }
    public DateTime NgayTap { get; set; }
    public DateTime ThoiGianVao { get; set; }
    public DateTime? ThoiGianRa { get; set; }
    public int? ThoiGianTapPhut { get; set; }
}

// Thống kê buổi tập
public class SessionStatsDto
{
    public int TongSoBuoiTap { get; set; }
    public int TongThoiGianPhut { get; set; }
    public double TrungBinhThoiGianPhut { get; set; }
    public int SoBuoiThangNay { get; set; }
    public int SoBuoiTuanNay { get; set; }
}
