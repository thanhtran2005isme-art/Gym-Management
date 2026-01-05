using GymManagement.API.Admin.DTOs;
using GymManagement.API.Admin.Data;

namespace GymManagement.API.Admin.Services
{
    public class GoiTapService : IGoiTapService
    {
        private readonly IGoiTapRepository _repo;

        public GoiTapService(IGoiTapRepository repo)
        {
            _repo = repo;
        }

        public List<GoiTapDto> GetAll() => _repo.GetAll();
        public GoiTapDto? GetById(int id) => _repo.GetById(id);

        public GoiTapDto Create(GoiTapDto dto)
        {
            if (dto.Gia <= 0) throw new ArgumentException("Giá phải lớn hơn 0");
            if (dto.SoThang <= 0) throw new ArgumentException("Số tháng phải lớn hơn 0");
            var id = _repo.Create(dto);
            dto.MaGoiTap = id;
            return dto;
        }

        public GoiTapDto? Update(int id, GoiTapDto dto)
        {
            if (!_repo.Update(id, dto)) return null;
            dto.MaGoiTap = id;
            return dto;
        }

        public bool Delete(int id) => _repo.Delete(id);
        public List<GoiTapDto> GetActive() => _repo.GetActive();
        public List<GoiTapDto> Search(string keyword) => _repo.Search(keyword);
    }
}
