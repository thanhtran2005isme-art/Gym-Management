using GymManagement.Shared.DTOs;

namespace GymManagement.API.Admin.Services
{
    public interface IChucVuService
    {
        Task<IEnumerable<ChucVuDto>> GetAllAsync();
        Task<ChucVuDto?> GetByIdAsync(int id);
        Task<ChucVuDto> CreateAsync(ChucVuDto dto);
        Task<ChucVuDto?> UpdateAsync(int id, ChucVuDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
