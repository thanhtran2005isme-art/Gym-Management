using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Data
{
    public interface IDangKyGoiTapRepository
    {
        List<DangKyGoiTapDto> GetAll();
        DangKyGoiTapDto? GetById(int id);
        List<DangKyGoiTapDto> GetByThanhVien(int maThanhVien);
        DangKyGoiTapDto? GetActiveByThanhVien(int maThanhVien);
        int Create(int maThanhVien, int maGoiTap, DateTime ngayBatDau, DateTime ngayKetThuc, int? soLanTap, decimal tongTien, string? ghiChu);
        bool UpdateTrangThai(int id, byte trangThai);
        List<DangKyGoiTapDto> GetSapHetHan(int soNgay);
        List<DangKyGoiTapDto> GetActive();
        (List<DangKyGoiTapDto> Items, int Total) GetPaged(int page, int pageSize);
    }
}
