using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Data
{
    public interface IDiemDanhRepository
    {
        Task<IEnumerable<DiemDanhDto>> GetAllAsync();
        Task<DiemDanhDto?> GetByIdAsync(int id);
        Task<IEnumerable<DiemDanhDto>> GetByThanhVienAsync(int maThanhVien);
        Task<IEnumerable<DiemDanhDto>> GetByDateAsync(DateTime date);
        Task<IEnumerable<DiemDanhDto>> GetActiveCheckInsAsync();
        Task<int> CheckInAsync(CreateDiemDanhDto dto);
        Task<bool> CheckOutAsync(int id, CheckOutDto dto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<DiemDanhThongKeDto>> GetThongKeAsync(DateTime fromDate, DateTime toDate);
    }
}
