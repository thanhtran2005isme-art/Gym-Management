namespace GymManagement.API.Trainer.DTOs
{
    // DTO thống kê tổng quan
    public class ThongKeTongQuanDto
    {
        public int SoHocVienHienTai { get; set; }
        public int SoBuoiTapTrongThang { get; set; }
        public int SoHopDongActive { get; set; }
        public int SoBuoiTapHomNay { get; set; }
        public int SoBuoiTapTuanNay { get; set; }
        public double TyLeHoanThanhBuoiTap { get; set; }
    }

    // DTO doanh thu/hoa hồng
    public class DoanhThuDto
    {
        public int Thang { get; set; }
        public int Nam { get; set; }
        public decimal TongDoanhThu { get; set; }
        public decimal HoaHong { get; set; }
        public int SoHopDongMoi { get; set; }
        public int SoBuoiDayHoanThanh { get; set; }
        public List<DoanhThuChiTietDto> ChiTiet { get; set; } = new();
    }

    // DTO chi tiết doanh thu
    public class DoanhThuChiTietDto
    {
        public string MaHopDong { get; set; } = string.Empty;
        public string TenHocVien { get; set; } = string.Empty;
        public string TenGoiPT { get; set; } = string.Empty;
        public decimal GiaTriHopDong { get; set; }
        public decimal HoaHong { get; set; }
        public DateTime NgayTao { get; set; }
    }

    // DTO tổng hợp buổi tập
    public class TongHopBuoiTapDto
    {
        public DateTime TuNgay { get; set; }
        public DateTime DenNgay { get; set; }
        public int TongBuoiTap { get; set; }
        public int BuoiHoanThanh { get; set; }
        public int BuoiVang { get; set; }
        public int BuoiHuy { get; set; }
        public double TyLeHoanThanh { get; set; }
        public List<BuoiTapTheoNgayDto> TheoNgay { get; set; } = new();
    }

    // DTO buổi tập theo ngày
    public class BuoiTapTheoNgayDto
    {
        public DateTime Ngay { get; set; }
        public int SoBuoi { get; set; }
        public int HoanThanh { get; set; }
        public int Vang { get; set; }
    }

    // DTO tỷ lệ tham gia học viên
    public class TyLeThamGiaDto
    {
        public double TyLeThamGiaTrungBinh { get; set; }
        public List<TyLeThamGiaHocVienDto> TheoHocVien { get; set; } = new();
    }

    // DTO tỷ lệ tham gia theo học viên
    public class TyLeThamGiaHocVienDto
    {
        public int HocVienId { get; set; }
        public string TenHocVien { get; set; } = string.Empty;
        public int TongBuoi { get; set; }
        public int BuoiThamGia { get; set; }
        public double TyLe { get; set; }
    }
}
