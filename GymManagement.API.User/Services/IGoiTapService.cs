using GymManagement.Shared.DTOs;

namespace GymManagement.API.User.Services
{
    public interface IGoiTapService
    {
        Task<IEnumerable<GoiTapDto>> GetAllActiveAsync();
        Task<GoiTapDto?> GetByIdAsync(int id);
    }
}
