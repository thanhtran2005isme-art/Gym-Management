using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Services
{
    public interface IHoaDonService
    {
        Task<IEnumerable<HoaDonDto>> GetAllAsync();
        Task<HoaDonDto?> GetByIdAsync(int id);
        Task<IEnumerable<HoaDonDto>> GetByThanhVienAsync(int maThanhVien);
        Task<int> CreateAsync(CreateHoaDonDto dto);
        Task<bool> UpdateAsync(int id, UpdateHoaDonDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
