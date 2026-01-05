using GymManagement.API.Admin.Data;
using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Services
{
    public class BuoiTapService : IBuoiTapService
    {
        private readonly IBuoiTapRepository _repository;

        public BuoiTapService(IBuoiTapRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<BuoiTapDto>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<BuoiTapDto?> GetByIdAsync(int maBuoiTap)
        {
            return await _repository.GetByIdAsync(maBuoiTap);
        }

        public async Task<IEnumerable<BuoiTapDto>> GetByThanhVienAsync(int maThanhVien)
        {
            return await _repository.GetByThanhVienAsync(maThanhVien);
        }

        public async Task<IEnumerable<BuoiTapDto>> GetByDateRangeAsync(DateTime tuNgay, DateTime denNgay)
        {
            return await _repository.GetByDateRangeAsync(tuNgay, denNgay);
        }

        public async Task<int> CreateAsync(CreateBuoiTapDto dto)
        {
            return await _repository.CreateAsync(dto);
        }

        public async Task<bool> UpdateAsync(int maBuoiTap, UpdateBuoiTapDto dto)
        {
            return await _repository.UpdateAsync(maBuoiTap, dto);
        }

        public async Task<bool> DeleteAsync(int maBuoiTap)
        {
            return await _repository.DeleteAsync(maBuoiTap);
        }
    }
}
