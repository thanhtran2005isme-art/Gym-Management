using GymManagement.Shared.DTOs;

namespace GymManagement.API.Admin.Services
{
    public interface IGoiTapService
    {
        Task<IEnumerable<GoiTapDto>> GetAllAsync();
        Task<GoiTapDto?> GetByIdAsync(int id);
        Task<GoiTapDto> CreateAsync(GoiTapDto dto);
        Task<GoiTapDto?> UpdateAsync(int id, GoiTapDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
