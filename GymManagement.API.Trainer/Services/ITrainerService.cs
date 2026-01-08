using GymManagement.API.Trainer.DTOs;

namespace GymManagement.API.Trainer.Services
{
    public interface ITrainerService
    {
        // Quản lý học viên
        Task<List<HocVienDto>> GetMyMembersAsync(int trainerId);
        Task<HocVienChiTietDto?> GetMemberByIdAsync(int trainerId, int memberId);
        Task<List<HopDongPTDto>> GetMemberContractsAsync(int trainerId, int memberId);
        Task<List<BuoiTapPTDto>> GetMemberSessionsAsync(int trainerId, int memberId);
        Task<List<HocVienDto>> GetActiveMembersAsync(int trainerId);

        // Thông tin cá nhân PT
        Task<TrainerProfileDto?> GetProfileAsync(int trainerId);
        Task<TrainerProfileDto?> UpdateProfileAsync(int trainerId, UpdateTrainerProfileDto dto);
        Task<ChuyenMonDto?> GetSpecializationAsync(int trainerId);

        // Thống kê & Báo cáo
        Task<ThongKeTongQuanDto> GetStatisticsAsync(int trainerId);
        Task<DoanhThuDto> GetRevenueAsync(int trainerId, int month, int year);
        Task<TongHopBuoiTapDto> GetSessionsSummaryAsync(int trainerId, DateTime from, DateTime to);
        Task<TyLeThamGiaDto> GetAttendanceRateAsync(int trainerId);
    }
}
