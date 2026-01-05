using System.ComponentModel.DataAnnotations;

namespace GymManagement.API.Admin.DTOs
{
    public class NhanVienDto
    {
        public int MaNhanVien { get; set; }

        [Required(ErrorMessage = "Họ tên là bắt buộc")]
        [StringLength(100, ErrorMessage = "Họ tên không được vượt quá 100 ký tự")]
        public string HoTen { get; set; } = null!;

        public DateTime? NgaySinh { get; set; }

        [StringLength(1, ErrorMessage = "Giới tính chỉ 1 ký tự (M/F)")]
        public string? GioiTinh { get; set; }

        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        [StringLength(20, ErrorMessage = "Số điện thoại không được vượt quá 20 ký tự")]
        public string? SoDienThoai { get; set; }

        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        [StringLength(100, ErrorMessage = "Email không được vượt quá 100 ký tự")]
        public string? Email { get; set; }

        [StringLength(255, ErrorMessage = "Địa chỉ không được vượt quá 255 ký tự")]
        public string? DiaChi { get; set; }

        public DateTime? NgayVaoLam { get; set; }
        public int? MaChucVu { get; set; }
        public string? TenChucVu { get; set; }

        [Range(0, 2, ErrorMessage = "Trạng thái phải từ 0-2")]
        public byte TrangThai { get; set; } = 1;
    }
}
