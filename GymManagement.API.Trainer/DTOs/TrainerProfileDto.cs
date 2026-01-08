namespace GymManagement.API.Trainer.DTOs
{
    // DTO hiển thị thông tin PT
    public class TrainerProfileDto
    {
        public int Id { get; set; }
        public string MaNhanVien { get; set; } = string.Empty;
        public string HoTen { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string SoDienThoai { get; set; } = string.Empty;
        public DateTime? NgaySinh { get; set; }
        public string GioiTinh { get; set; } = string.Empty;
        public string DiaChi { get; set; } = string.Empty;
        public string AnhDaiDien { get; set; } = string.Empty;
        public string ChuyenMon { get; set; } = string.Empty;
        public string MoTa { get; set; } = string.Empty;
        public int KinhNghiem { get; set; } // Số năm
        public List<string> ChungChi { get; set; } = new();
        public DateTime NgayVaoLam { get; set; }
        public string TrangThai { get; set; } = string.Empty;
    }

    // DTO cập nhật thông tin PT
    public class UpdateTrainerProfileDto
    {
        public string? HoTen { get; set; }
        public string? SoDienThoai { get; set; }
        public string? DiaChi { get; set; }
        public string? AnhDaiDien { get; set; }
        public string? ChuyenMon { get; set; }
        public string? MoTa { get; set; }
    }

    // DTO chuyên môn PT
    public class ChuyenMonDto
    {
        public int Id { get; set; }
        public string TenChuyenMon { get; set; } = string.Empty;
        public string MoTa { get; set; } = string.Empty;
        public int SoNamKinhNghiem { get; set; }
        public List<string> ChungChi { get; set; } = new();
    }
}
