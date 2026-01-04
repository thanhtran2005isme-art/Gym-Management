namespace GymManagement.API.User.DTOs;

// Response - Thông tin cá nhân
public class ProfileDto
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
}

// Request - Cập nhật thông tin
public class UpdateProfileDto
{
    public string? HoTen { get; set; }
    public DateTime? NgaySinh { get; set; }
    public string? GioiTinh { get; set; }
    public string? SoDienThoai { get; set; }
    public string? Email { get; set; }
    public string? DiaChi { get; set; }
}

// Request - Đổi mật khẩu
public class ChangePasswordDto
{
    public string MatKhauCu { get; set; } = string.Empty;
    public string MatKhauMoi { get; set; } = string.Empty;
    public string XacNhanMatKhau { get; set; } = string.Empty;
}
