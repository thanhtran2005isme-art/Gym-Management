using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Services
{
    public interface IThanhToanService
    {
        Task<IEnumerable<ThanhToanDto>> GetByHoaDonAsync(int maHoaDon);
        Task<int> CreateAsync(CreateThanhToanDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
