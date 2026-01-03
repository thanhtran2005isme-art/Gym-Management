namespace GymManagement.API.User.DTOs;

// Response DTO - Thông tin cá nhân thành viên
public class ThongTinCaNhanDto
{
    public int MaThanhVien { get; set; }
    public string? MaThe { get; set; }
    public string HoTen { get; set; } = string.Empty;
    public DateTime? NgaySinh { get; set; }
    public string? GioiTinh { get; set; }
    public string? SoDienThoai { get; set; }
    public string? Email { get; set; }
    public string? DiaChi { get; set; }
    public DateTime NgayDangKy { get; set; }
    public int TrangThai { get; set; }
    public string? GhiChu { get; set; }
}

// Request DTO - Cập nhật thông tin cá nhân
public class CapNhatThongTinRequestDto
{
    public string? HoTen { get; set; }
    public DateTime? NgaySinh { get; set; }
    public string? GioiTinh { get; set; }
    public string? SoDienThoai { get; set; }
    public string? Email { get; set; }
    public string? DiaChi { get; set; }
}

// Request DTO - Đổi mật khẩu
public class DoiMatKhauRequestDto
{
    public string MatKhauCu { get; set; } = string.Empty;
    public string MatKhauMoi { get; set; } = string.Empty;
    public string XacNhanMatKhauMoi { get; set; } = string.Empty;
}
