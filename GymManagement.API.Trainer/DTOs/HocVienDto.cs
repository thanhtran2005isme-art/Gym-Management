namespace GymManagement.API.Trainer.DTOs
{
    // DTO hiển thị học viên
    public class HocVienDto
    {
        public int Id { get; set; }
        public string MaThanhVien { get; set; } = string.Empty;
        public string HoTen { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string SoDienThoai { get; set; } = string.Empty;
        public DateTime? NgaySinh { get; set; }
        public string GioiTinh { get; set; } = string.Empty;
        public string DiaChi { get; set; } = string.Empty;
        public string AnhDaiDien { get; set; } = string.Empty;
        public DateTime NgayDangKy { get; set; }
        public string TrangThai { get; set; } = string.Empty; // Active, Inactive
    }

    // DTO chi tiết học viên với thông tin tập luyện
    public class HocVienChiTietDto : HocVienDto
    {
        public int TongSoBuoiTap { get; set; }
        public int SoBuoiHoanThanh { get; set; }
        public int SoBuoiVang { get; set; }
        public double TyLeHoanThanh { get; set; }
        public DateTime? BuoiTapGanNhat { get; set; }
        public List<HopDongPTDto> DanhSachHopDong { get; set; } = new();
    }

    // DTO thống kê học viên
    public class ThongKeHocVienDto
    {
        public int TongHocVien { get; set; }
        public int HocVienActive { get; set; }
        public int HocVienMoi { get; set; } // Trong tháng
        public double TyLeDuyTri { get; set; }
    }
}
