using GymManagement.API.Admin.Data;
using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Services
{
    public class DiemDanhService : IDiemDanhService
    {
        private readonly IDiemDanhRepository _repository;

        public DiemDanhService(IDiemDanhRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<DiemDanhDto>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<DiemDanhDto?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<DiemDanhDto>> GetByThanhVienAsync(int maThanhVien)
        {
            return await _repository.GetByThanhVienAsync(maThanhVien);
        }

        public async Task<IEnumerable<DiemDanhDto>> GetByDateAsync(DateTime date)
        {
            return await _repository.GetByDateAsync(date);
        }

        public async Task<IEnumerable<DiemDanhDto>> GetActiveCheckInsAsync()
        {
            return await _repository.GetActiveCheckInsAsync();
        }

        public async Task<int> CheckInAsync(CreateDiemDanhDto dto)
        {
            return await _repository.CheckInAsync(dto);
        }

        public async Task<bool> CheckOutAsync(int id, CheckOutDto dto)
        {
            return await _repository.CheckOutAsync(id, dto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<DiemDanhThongKeDto>> GetThongKeAsync(DateTime fromDate, DateTime toDate)
        {
            return await _repository.GetThongKeAsync(fromDate, toDate);
        }
    }
}
