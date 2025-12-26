using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Services
{
    public interface IGoiTapService
    {
        List<GoiTapDto> GetAll();
        GoiTapDto? GetById(int id);
        GoiTapDto Create(GoiTapDto dto);
        GoiTapDto? Update(int id, GoiTapDto dto);
        bool Delete(int id);
        List<GoiTapDto> GetActive();
        List<GoiTapDto> Search(string keyword);
    }
}
