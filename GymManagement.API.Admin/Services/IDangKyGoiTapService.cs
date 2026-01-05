using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Services
{
    public interface IDangKyGoiTapService
    {
        List<DangKyGoiTapDto> GetAll();
        DangKyGoiTapDto? GetById(int id);
        List<DangKyGoiTapDto> GetByThanhVien(int maThanhVien);
        DangKyGoiTapDto? GetActiveByThanhVien(int maThanhVien);
        DangKyGoiTapDto Create(DangKyGoiTapCreateDto dto);
        DangKyGoiTapDto? GiaHan(GiaHanGoiTapDto dto);
        bool HuyDangKy(int id);
        List<DangKyGoiTapDto> GetSapHetHan(int soNgay = 7);
        List<DangKyGoiTapDto> GetActive();
        (List<DangKyGoiTapDto> Items, int Total) GetPaged(int page, int pageSize);
    }
}
