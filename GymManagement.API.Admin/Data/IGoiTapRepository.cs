using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Data
{
    public interface IGoiTapRepository
    {
        List<GoiTapDto> GetAll();
        GoiTapDto? GetById(int id);
        int Create(GoiTapDto dto);
        bool Update(int id, GoiTapDto dto);
        bool Delete(int id);
        List<GoiTapDto> GetActive();
        List<GoiTapDto> Search(string keyword);
    }
}
