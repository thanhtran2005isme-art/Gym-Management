namespace GymManagement.API.Trainer.DTOs
{
    // DTO hiển thị buổi tập PT
    public class BuoiTapPTDto
    {
        public int Id { get; set; }
        public int LichDayId { get; set; }
        public int TrainerId { get; set; }
        public string TenTrainer { get; set; } = string.Empty;
        public int HocVienId { get; set; }
        public string TenHocVien { get; set; } = string.Empty;
        public DateTime NgayTap { get; set; }
        public TimeSpan GioBatDau { get; set; }
        public TimeSpan GioKetThuc { get; set; }
        public string DiaDiem { get; set; } = string.Empty;
        public string TrangThai { get; set; } = string.Empty; // DangTap, HoanThanh, Vang, HuyBo
        public string NoiDungBuoiTap { get; set; } = string.Empty;
        public string BaiTap { get; set; } = string.Empty;
        public int SoSet { get; set; }
        public int SoRep { get; set; }
        public double? CanNangSuDung { get; set; } // kg
        public string DanhGiaTrainer { get; set; } = string.Empty;
        public int? DiemDanhGia { get; set; } // 1-5
        public string GhiChuHocVien { get; set; } = string.Empty;
        public DateTime? ThoiGianCheckIn { get; set; }
        public DateTime? ThoiGianCheckOut { get; set; }
    }
}
