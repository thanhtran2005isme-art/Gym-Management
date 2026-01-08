using GymManagement.API.Trainer.DTOs;

namespace GymManagement.API.Trainer.Services
{
    public interface IGoiPTService
    {
        Task<List<GoiPTDto>> GetAllAsync();
        Task<GoiPTDto?> GetByIdAsync(int id);
        Task<List<GoiPTDto>> GetActiveAsync();
    }
}
