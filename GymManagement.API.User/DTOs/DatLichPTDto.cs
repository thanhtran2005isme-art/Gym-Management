namespace GymManagement.API.User.DTOs;

// Request DTO - Đặt lịch PT
public class DatLichPTRequestDto
{
    public int MaHopDongPT { get; set; }
    public DateTime ThoiGianBatDau { get; set; }
    public DateTime ThoiGianKetThuc { get; set; }
    public string? GhiChu { get; set; }
}

// Response DTO - Thông tin buổi tập PT
public class BuoiTapPTDto
{
    public int MaBuoiTapPT { get; set; }
    public int MaHopDongPT { get; set; }
    public DateTime ThoiGianBatDau { get; set; }
    public DateTime ThoiGianKetThuc { get; set; }
    public int TrangThai { get; set; }
    public string? TrangThaiText { get; set; }
    public string? GhiChu { get; set; }
}

// Response DTO - Danh sách hợp đồng PT của user
public class HopDongPTDto
{
    public int MaHopDongPT { get; set; }
    public string? TenGoiPT { get; set; }
    public string? TenHuanLuyenVien { get; set; }
    public DateTime NgayBatDau { get; set; }
    public DateTime NgayKetThuc { get; set; }
    public int SoBuoiConLai { get; set; }
    public int TrangThai { get; set; }
}

// DTO cập nhật lịch PT
public class CapNhatLichPTDto
{
    public DateTime ThoiGianBatDau { get; set; }
    public DateTime ThoiGianKetThuc { get; set; }
    public string? GhiChu { get; set; }
}
