using GymManagement.Shared.DTOs;

namespace GymManagement.API.User.Services
{
    public interface ICheckInService
    {
        Task<CheckInDto> CheckInAsync(CheckInRequest request);
        Task<CheckInDto?> CheckOutAsync(CheckOutRequest request);
        Task<IEnumerable<CheckInDto>> GetHistoryByMemberAsync(int maThanhVien);
        Task<CheckInDto?> GetCurrentCheckInAsync(int maThanhVien);
    }
}
