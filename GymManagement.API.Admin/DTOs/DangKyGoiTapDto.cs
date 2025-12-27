using System.ComponentModel.DataAnnotations;

namespace GymManagement.API.Admin.DTOs
{
    public class DangKyGoiTapDto
    {
        public int MaDangKy { get; set; }
        public int MaThanhVien { get; set; }
        public string? TenThanhVien { get; set; }
        public string? MaThe { get; set; }
        public int MaGoiTap { get; set; }
        public string? TenGoiTap { get; set; }
        public DateTime NgayDangKy { get; set; }
        public DateTime NgayBatDau { get; set; }
        public DateTime NgayKetThuc { get; set; }
        public int? SoLanTapConLai { get; set; }
        public decimal TongTien { get; set; }
        public string? GhiChu { get; set; }
        public byte TrangThai { get; set; }

        public string TrangThaiText => TrangThai switch
        {
            1 => "Đang hoạt động",
            0 => "Hết hạn",
            2 => "Đã hủy",
            _ => "Không xác định"
        };
    }

    public class DangKyGoiTapCreateDto
    {
        [Required(ErrorMessage = "Mã thành viên là bắt buộc")]
        [Range(1, int.MaxValue, ErrorMessage = "Mã thành viên không hợp lệ")]
        public int MaThanhVien { get; set; }

        [Required(ErrorMessage = "Mã gói tập là bắt buộc")]
        [Range(1, int.MaxValue, ErrorMessage = "Mã gói tập không hợp lệ")]
        public int MaGoiTap { get; set; }

        public DateTime? NgayBatDau { get; set; }

        [StringLength(255, ErrorMessage = "Ghi chú không được vượt quá 255 ký tự")]
        public string? GhiChu { get; set; }
    }

    public class GiaHanGoiTapDto
    {
        [Required(ErrorMessage = "Mã đăng ký là bắt buộc")]
        [Range(1, int.MaxValue, ErrorMessage = "Mã đăng ký không hợp lệ")]
        public int MaDangKy { get; set; }

        [Required(ErrorMessage = "Mã gói tập là bắt buộc")]
        [Range(1, int.MaxValue, ErrorMessage = "Mã gói tập không hợp lệ")]
        public int MaGoiTap { get; set; }

        [StringLength(255, ErrorMessage = "Ghi chú không được vượt quá 255 ký tự")]
        public string? GhiChu { get; set; }
    }
}
