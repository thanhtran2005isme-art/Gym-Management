using GymManagement.API.Admin.Data;
using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Services
{
    public class GoiPTService : IGoiPTService
    {
        private readonly IGoiPTRepository _repository;

        public GoiPTService(IGoiPTRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<GoiPTDto> GetAll() => _repository.GetAll();

        public GoiPTDto? GetById(int id) => _repository.GetById(id);

        public GoiPTDto Create(GoiPTDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.TenGoiPT))
                throw new ArgumentException("Tên gói PT không được để trống");

            if (dto.SoBuoi <= 0)
                throw new ArgumentException("Số buổi phải lớn hơn 0");

            if (dto.Gia <= 0)
                throw new ArgumentException("Giá phải lớn hơn 0");

            return _repository.Create(dto);
        }

        public GoiPTDto? Update(int id, GoiPTDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.TenGoiPT))
                throw new ArgumentException("Tên gói PT không được để trống");

            if (dto.SoBuoi <= 0)
                throw new ArgumentException("Số buổi phải lớn hơn 0");

            if (dto.Gia <= 0)
                throw new ArgumentException("Giá phải lớn hơn 0");

            return _repository.Update(id, dto);
        }

        public bool Delete(int id) => _repository.Delete(id);

        public IEnumerable<GoiPTDto> GetActive() => _repository.GetActive();

        public IEnumerable<GoiPTDto> Search(string keyword) => _repository.Search(keyword);
    }
}
