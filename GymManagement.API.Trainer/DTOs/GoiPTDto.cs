namespace GymManagement.API.Trainer.DTOs
{
    // DTO hiển thị gói PT
    public class GoiPTDto
    {
        public int Id { get; set; }
        public string MaGoi { get; set; } = string.Empty;
        public string TenGoi { get; set; } = string.Empty;
        public string MoTa { get; set; } = string.Empty;
        public int SoBuoi { get; set; }
        public int ThoiHan { get; set; } // Số ngày hiệu lực
        public decimal Gia { get; set; }
        public decimal GiaKhuyenMai { get; set; }
        public bool IsActive { get; set; }
        public string LoaiGoi { get; set; } = string.Empty; // CoBan, NangCao, VIP
        public DateTime NgayTao { get; set; }
    }
}
