namespace GymManagement.API.User.DTOs;

// Response DTO - Danh sách lớp học nhóm
public class LopHocNhomDto
{
    public int MaLopHoc { get; set; }
    public string TenLopHoc { get; set; } = string.Empty;
    public string? LoaiLop { get; set; }
    public int? DoKho { get; set; }
    public string? MoTa { get; set; }
}

// Response DTO - Lịch lớp nhóm
public class LichLopNhomDto
{
    public int MaLichLopNhom { get; set; }
    public string TenLopHoc { get; set; } = string.Empty;
    public string TenPhong { get; set; } = string.Empty;
    public string TenHuanLuyenVien { get; set; } = string.Empty;
    public int ThuTrongTuan { get; set; }
    public string? ThuText { get; set; }
    public TimeSpan GioBatDau { get; set; }
    public TimeSpan GioKetThuc { get; set; }
    public int SoLuongToiDa { get; set; }
    public int SoLuongDaDangKy { get; set; }
    public DateTime NgayBatDau { get; set; }
    public DateTime NgayKetThuc { get; set; }
}

// Request DTO - Đăng ký lớp nhóm
public class DangKyLopNhomRequestDto
{
    public int MaLichLopNhom { get; set; }
    public string? GhiChu { get; set; }
}

// Response DTO - Thông tin đăng ký lớp nhóm
public class DangKyLopNhomDto
{
    public int MaDangKy { get; set; }
    public int MaLichLopNhom { get; set; }
    public string TenLopHoc { get; set; } = string.Empty;
    public DateTime NgayDangKy { get; set; }
    public int TrangThai { get; set; }
    public string? TrangThaiText { get; set; }
    public string? GhiChu { get; set; }
}
