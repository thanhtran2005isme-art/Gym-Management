using GymManagement.API.Trainer.DTOs;

namespace GymManagement.API.Trainer.Services
{
    public interface IThongBaoService
    {
        Task<List<ThongBaoDto>> GetMyNotificationsAsync(int trainerId);
        Task<bool> MarkAsReadAsync(int id);
        Task<UnreadCountDto> GetUnreadCountAsync(int trainerId);
    }
}
