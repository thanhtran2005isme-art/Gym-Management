namespace GymManagement.API.Trainer.DTOs
{
    // DTO hiển thị hợp đồng PT
    public class HopDongPTDto
    {
        public int Id { get; set; }
        public string MaHopDong { get; set; } = string.Empty;
        public int TrainerId { get; set; }
        public string TenTrainer { get; set; } = string.Empty;
        public int MaThanhVien { get; set; }
        public string TenThanhVien { get; set; } = string.Empty;
        public string SoDienThoai { get; set; } = string.Empty;
        public int GoiPTId { get; set; }
        public string TenGoiPT { get; set; } = string.Empty;
        public int TongSoBuoi { get; set; }
        public int SoBuoiDaSuDung { get; set; }
        public int SoBuoiConLai { get; set; }
        public DateTime NgayBatDau { get; set; }
        public DateTime NgayKetThuc { get; set; }
        public decimal GiaTriHopDong { get; set; }
        public string TrangThai { get; set; } = string.Empty; // Active, Expired, Cancelled, Pending
        public DateTime NgayTao { get; set; }
        public string GhiChu { get; set; } = string.Empty;
    }

    // DTO tạo hợp đồng PT mới
    public class CreateHopDongPTDto
    {
        public int MaThanhVien { get; set; }
        public int GoiPTId { get; set; }
        public DateTime NgayBatDau { get; set; }
        public string GhiChu { get; set; } = string.Empty;
    }
}
