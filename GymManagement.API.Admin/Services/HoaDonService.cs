using GymManagement.API.Admin.Data;
using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Services
{
    public class HoaDonService : IHoaDonService
    {
        private readonly IHoaDonRepository _repository;

        public HoaDonService(IHoaDonRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<HoaDonDto>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<HoaDonDto?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<HoaDonDto>> GetByThanhVienAsync(int maThanhVien)
        {
            return await _repository.GetByThanhVienAsync(maThanhVien);
        }

        public async Task<int> CreateAsync(CreateHoaDonDto dto)
        {
            return await _repository.CreateAsync(dto);
        }

        public async Task<bool> UpdateAsync(int id, UpdateHoaDonDto dto)
        {
            return await _repository.UpdateAsync(id, dto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}
