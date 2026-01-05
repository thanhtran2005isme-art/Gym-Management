using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Data
{
    public interface IGoiPTRepository
    {
        IEnumerable<GoiPTDto> GetAll();
        GoiPTDto? GetById(int id);
        GoiPTDto Create(GoiPTDto dto);
        GoiPTDto? Update(int id, GoiPTDto dto);
        bool Delete(int id);
        IEnumerable<GoiPTDto> GetActive();
        IEnumerable<GoiPTDto> Search(string keyword);
    }
}
