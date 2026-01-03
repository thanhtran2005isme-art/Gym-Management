namespace GymManagement.API.Trainer.DTOs
{
    // DTO hiển thị lịch dạy
    public class LichDayDto
    {
        public int Id { get; set; }
        public int TrainerId { get; set; }
        public string TenTrainer { get; set; } = string.Empty;
        public int HocVienId { get; set; }
        public string TenHocVien { get; set; } = string.Empty;
        public DateTime NgayDay { get; set; }
        public TimeSpan GioBatDau { get; set; }
        public TimeSpan GioKetThuc { get; set; }
        public string DiaDiem { get; set; } = string.Empty;
        public string TrangThai { get; set; } = string.Empty; // DaXacNhan, ChoXacNhan, DaHuy
        public string GhiChu { get; set; } = string.Empty;
    }

    // DTO tạo lịch dạy mới
    public class CreateLichDayDto
    {
        public int HocVienId { get; set; }
        public DateTime NgayDay { get; set; }
        public TimeSpan GioBatDau { get; set; }
        public TimeSpan GioKetThuc { get; set; }
        public string DiaDiem { get; set; } = string.Empty;
        public string GhiChu { get; set; } = string.Empty;
    }

    // DTO cập nhật lịch dạy
    public class UpdateLichDayDto
    {
        public DateTime? NgayDay { get; set; }
        public TimeSpan? GioBatDau { get; set; }
        public TimeSpan? G