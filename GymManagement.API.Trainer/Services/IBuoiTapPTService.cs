using GymManagement.API.Trainer.DTOs;

namespace GymManagement.API.Trainer.Services
{
    public interface IBuoiTapPTService
    {
        Task<List<BuoiTapPTDto>> GetMyScheduleAsync(int trainerId);
        Task<List<BuoiTapPTDto>> GetByDateAsync(int trainerId, DateTime date);
        Task<List<BuoiTapPTDto>> GetUpcomingAsync(int trainerId);
        Task<BuoiTapPTDto?> GetByIdAsync(int id);
        Task<BuoiTapPTDto> CreateAsync(int trainerId, CreateBuoiTapPTDto dto);
        Task<BuoiTapPTDto?> UpdateAsync(int id, UpdateBuoiTapPTDto dto);
        Task<bool> DeleteAsync(int id);
        Task<BuoiTapPTDto?> CompleteAsync(int id);
        Task<List<BuoiTapPTDto>> GetHistoryAsync(int trainerId, DateTime from, DateTime to);
    }
}
