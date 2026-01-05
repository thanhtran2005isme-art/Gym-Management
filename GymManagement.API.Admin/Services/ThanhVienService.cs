using GymManagement.API.Admin.DTOs;
using GymManagement.API.Admin.Data;

namespace GymManagement.API.Admin.Services
{
    public class ThanhVienService : IThanhVienService
    {
        private readonly IThanhVienRepository _repo;

        public ThanhVienService(IThanhVienRepository repo)
        {
            _repo = repo;
        }

        public List<ThanhVienDto> GetAll() => _repo.GetAll();
        public ThanhVienDto? GetById(int id) => _repo.GetById(id);

        public ThanhVienDto Create(ThanhVienDto dto)
        {
            var id = _repo.Create(dto);
            dto.MaThanhVien = id;
            return dto;
        }

        public ThanhVienDto? Update(int id, ThanhVienDto dto)
        {
            if (!_repo.Update(id, dto)) return null;
            dto.MaThanhVien = id;
            return dto;
        }

        public bool Delete(int id) => _repo.Delete(id);
        public List<ThanhVienDto> Search(string keyword) => _repo.Search(keyword);
        public List<ThanhVienDto> GetActive() => _repo.GetActive();
        public (List<ThanhVienDto> Items, int Total) GetPaged(int page, int pageSize) => _repo.GetPaged(page, pageSize);
    }
}
