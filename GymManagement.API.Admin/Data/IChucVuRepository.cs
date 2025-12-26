using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Data
{
    public interface IChucVuRepository
    {
        List<ChucVuDto> GetAll();
        ChucVuDto? GetById(int id);
        int Create(ChucVuDto dto);
        bool Update(int id, ChucVuDto dto);
        bool Delete(int id);
    }
}
