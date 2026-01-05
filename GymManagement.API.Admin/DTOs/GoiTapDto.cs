using System.ComponentModel.DataAnnotations;

namespace GymManagement.API.Admin.DTOs
{
    public class GoiTapDto
    {
        public int MaGoiTap { get; set; }

        [Required(ErrorMessage = "Tên gói tập là bắt buộc")]
        [StringLength(100, ErrorMessage = "Tên gói tập không được vượt quá 100 ký tự")]
        public string TenGoiTap { get; set; } = null!;

        [Required(ErrorMessage = "Số tháng là bắt buộc")]
        [Range(1, 36, ErrorMessage = "Số tháng phải từ 1-36")]
        public int SoThang { get; set; }

        [Range(0, 1000, ErrorMessage = "Số lần tập tối đa phải từ 0-1000")]
        public int? SoLanTapToiDa { get; set; }

        [Required(ErrorMessage = "Giá là bắt buộc")]
        [Range(0, 100000000, ErrorMessage = "Giá phải từ 0 đến 100 triệu")]
        public decimal Gia { get; set; }

        [StringLength(255, ErrorMessage = "Mô tả không được vượt quá 255 ký tự")]
        public string? MoTa { get; set; }

        [Range(0, 2, ErrorMessage = "Trạng thái phải từ 0-2")]
        public byte TrangThai { get; set; } = 1;
    }
}
