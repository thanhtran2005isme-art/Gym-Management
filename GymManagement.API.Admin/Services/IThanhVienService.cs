using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Services
{
    public interface IThanhVienService
    {
        Task<IEnumerable<ThanhVienDto>> GetAllAsync();
        Task<ThanhVienDto?> GetByIdAsync(int id);
        Task<ThanhVienDto> CreateAsync(ThanhVienDto dto);
        Task<ThanhVienDto?> UpdateAsync(int id, ThanhVienDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
