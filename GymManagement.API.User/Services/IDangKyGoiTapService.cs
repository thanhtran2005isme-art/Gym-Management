using GymManagement.Shared.DTOs;

namespace GymManagement.API.User.Services
{
    public interface IDangKyGoiTapService
    {
        Task<DangKyGoiTapDto> DangKyAsync(DangKyGoiTapRequest request);
        Task<IEnumerable<DangKyGoiTapDto>> GetByMemberAsync(int maThanhVien);
        Task<DangKyGoiTapDto?> GetActivePackageAsync(int maThanhVien);
        Task<bool> HuyDangKyAsync(int maDangKy);
    }
}
