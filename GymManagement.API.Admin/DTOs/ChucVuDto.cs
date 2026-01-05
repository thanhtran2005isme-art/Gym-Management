using System.ComponentModel.DataAnnotations;

namespace GymManagement.API.Admin.DTOs
{
    public class ChucVuDto
    {
        public int MaChucVu { get; set; }

        [Required(ErrorMessage = "Tên chức vụ là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên chức vụ không được vượt quá 100 ký tự")]
        public string TenChucVu { get; set; } = null!;

        [StringLength(255, ErrorMessage = "Mô tả không được vượt quá 255 ký tự")]
        public string? MoTa { get; set; }
    }
}
