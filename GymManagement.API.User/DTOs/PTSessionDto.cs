namespace GymManagement.API.User.DTOs;

// Buổi tập PT
public class PTSessionDto
{
    public int MaBuoiTapPT { get; set; }
    public int MaHopDongPT { get; set; }
    public string TenGoiPT { get; set; } = string.Empty;
    public string TenHuanLuyenVien { get; set; } = string.Empty;
    public DateTime ThoiGianBatDau { get; set; }
    public DateTime ThoiGianKetThuc { get; set; }
    public int TrangThai { get; set; }
    public string? TrangThaiText { get; set; }
    public string? GhiChu { get; set; }
}

// Hợp đồng PT của user
public class MyPTContractDto
{
    public int MaHopDongPT { get; set; }
    public string TenGoiPT { get; set; } = string.Empty;
    public string TenHuanLuyenVien { get; set; } = string.Empty;
    public string? SoDienThoaiHLV { get; set; }
    public DateTime NgayBatDau { get; set; }
    public DateTime NgayKetThuc { get; set; }
    public int TongSoBuoi { get; set; }
    public int SoBuoiDaTap { get; set; }
    public int SoBuoiConLai { get; set; }
    public decimal TongTien { get; set; }
    public int TrangThai { get; set; }
    public string? TrangThaiText { get; set; }
}
