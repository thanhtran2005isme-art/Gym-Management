using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Services
{
    public interface IBuoiTapService
    {
        Task<IEnumerable<BuoiTapDto>> GetAllAsync();
        Task<BuoiTapDto?> GetByIdAsync(int maBuoiTap);
        Task<IEnumerable<BuoiTapDto>> GetByThanhVienAsync(int maThanhVien);
        Task<IEnumerable<BuoiTapDto>> GetByDateRangeAsync(DateTime tuNgay, DateTime denNgay);
        Task<int> CreateAsync(CreateBuoiTapDto dto);
        Task<bool> UpdateAsync(int maBuoiTap, UpdateBuoiTapDto dto);
        Task<bool> DeleteAsync(int maBuoiTap);
    }
}
