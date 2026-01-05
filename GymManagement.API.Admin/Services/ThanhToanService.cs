using GymManagement.API.Admin.Data;
using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Services
{
    public class ThanhToanService : IThanhToanService
    {
        private readonly IThanhToanRepository _repository;

        public ThanhToanService(IThanhToanRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ThanhToanDto>> GetByHoaDonAsync(int maHoaDon)
        {
            return await _repository.GetByHoaDonAsync(maHoaDon);
        }

        public async Task<int> CreateAsync(CreateThanhToanDto dto)
        {
            return await _repository.CreateAsync(dto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}
