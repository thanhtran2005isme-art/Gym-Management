using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Services
{
    public interface INhanVienService
    {
        Task<IEnumerable<NhanVienDto>> GetAllAsync();
        Task<NhanVienDto?> GetByIdAsync(int id);
        Task<NhanVienDto> CreateAsync(NhanVienDto dto);
        Task<NhanVienDto?> UpdateAsync(int id, NhanVienDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
