using GymManagement.API.Admin.DTOs;
using GymManagement.API.Admin.Data;

namespace GymManagement.API.Admin.Services
{
    public class NhanVienService : INhanVienService
    {
        private readonly INhanVienRepository _repo;

        public NhanVienService(INhanVienRepository repo)
        {
            _repo = repo;
        }

        public List<NhanVienDto> GetAll() => _repo.GetAll();
        public NhanVienDto? GetById(int id) => _repo.GetById(id);

        public NhanVienDto Create(NhanVienDto dto)
        {
            var id = _repo.Create(dto);
            dto.MaNhanVien = id;
            return dto;
        }

        public NhanVienDto? Update(int id, NhanVienDto dto)
        {
            if (!_repo.Update(id, dto)) return null;
            dto.MaNhanVien = id;
            return dto;
        }

        public bool Delete(int id) => _repo.Delete(id);
        public List<NhanVienDto> Search(string keyword) => _repo.Search(keyword);
        public List<NhanVienDto> GetByChucVu(int maChucVu) => _repo.GetByChucVu(maChucVu);
        public List<NhanVienDto> GetTrainers() => _repo.GetTrainers();
        public (List<NhanVienDto> Items, int Total) GetPaged(int page, int pageSize) => _repo.GetPaged(page, pageSize);
    }
}
