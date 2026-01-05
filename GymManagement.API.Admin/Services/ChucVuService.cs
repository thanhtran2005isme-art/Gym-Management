using GymManagement.API.Admin.DTOs;
using GymManagement.API.Admin.Data;

namespace GymManagement.API.Admin.Services
{
    public class ChucVuService : IChucVuService
    {
        private readonly IChucVuRepository _repo;

        public ChucVuService(IChucVuRepository repo)
        {
            _repo = repo;
        }

        public List<ChucVuDto> GetAll() => _repo.GetAll();
        public ChucVuDto? GetById(int id) => _repo.GetById(id);

        public ChucVuDto Create(ChucVuDto dto)
        {
            var id = _repo.Create(dto);
            dto.MaChucVu = id;
            return dto;
        }

        public ChucVuDto? Update(int id, ChucVuDto dto)
        {
            if (!_repo.Update(id, dto)) return null;
            dto.MaChucVu = id;
            return dto;
        }

        public bool Delete(int id) => _repo.Delete(id);
    }
}
