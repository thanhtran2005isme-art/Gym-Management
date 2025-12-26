using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Data
{
    public interface IThanhVienRepository
    {
        List<ThanhVienDto> GetAll();
        ThanhVienDto? GetById(int id);
        int Create(ThanhVienDto dto);
        bool Update(int id, ThanhVienDto dto);
        bool Delete(int id);
        List<ThanhVienDto> Search(string keyword);
        List<ThanhVienDto> GetActive();
        (List<ThanhVienDto> Items, int Total) GetPaged(int page, int pageSize);
    }
}
