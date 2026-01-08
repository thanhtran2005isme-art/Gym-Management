using GymManagement.API.Trainer.DTOs;

namespace GymManagement.API.Trainer.Services
{
    public interface IHopDongPTService
    {
        Task<List<HopDongPTDto>> GetMyContractsAsync(int trainerId);
        Task<HopDongPTDto?> GetByIdAsync(int id);
        Task<List<HopDongPTDto>> GetActiveContractsAsync(int trainerId);
        Task<List<HopDongPTDto>> GetByMemberAsync(int maThanhVien);
        Task<List<HopDongPTDto>> GetExpiringContractsAsync(int trainerId, int days);
    }
}
