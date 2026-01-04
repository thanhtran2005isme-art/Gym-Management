namespace GymManagement.API.User.DTOs;

// Gói tập đã đăng ký của user
public class MyPackageDto
{
    public int MaHopDongGoiTap { get; set; }
    public string TenGoiTap { get; set; } = string.Empty;
    public DateTime NgayBatDau { get; set; }
    public DateTime NgayKetThuc { get; set; }
    public decimal TongTien { get; set; }
    public decimal SoTienGiam { get; set; }
    public decimal SoTienPhaiTra { get; set; }
    public int TrangThai { get; set; }
    public string? TrangThaiText { get; set; }
    public int SoNgayConLai { get; set; }
}

// Chi tiết gói tập đã đăng ký
public class MyPackageDetailDto : MyPackageDto
{
    public int? SoLanTapToiDa { get; set; }
    public int SoLanDaTap { get; set; }
    public string? MoTaGoiTap { get; set; }
    public DateTime NgayTao { get; set; }
}

// Danh sách gói tập (để đăng ký)
public class GoiTapDto
{
    public int MaGoiTap { get; set; }
    public string TenGoiTap { get; set; } = string.Empty;
    public int SoThang { get; set; }
    public int? SoLanTapToiDa { get; set; }
    public decimal Gia { get; set; }
    public string? MoTa { get; set; }
}

// Danh sách gói PT
public class GoiPTDto
{
    public int MaGoiPT { get; set; }
    public string TenGoiPT { get; set; } = string.Empty;
    public int SoBuoi { get; set; }
    public decimal Gia { get; set; }
    public string? MoTa { get; set; }
}
