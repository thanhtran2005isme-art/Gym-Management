using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Services
{
    public interface IThanhVienService
    {
        List<ThanhVienDto> GetAll();
        ThanhVienDto? GetById(int id);
        ThanhVienDto Create(ThanhVienDto dto);
        ThanhVienDto? Update(int id, ThanhVienDto dto);
        bool Delete(int id);
        List<ThanhVienDto> Search(string keyword);
        List<ThanhVienDto> GetActive();
        (List<ThanhVienDto> Items, int Total) GetPaged(int page, int pageSize);
    }
}
