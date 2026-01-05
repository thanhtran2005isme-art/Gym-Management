using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Services
{
    public interface IChucVuService
    {
        List<ChucVuDto> GetAll();
        ChucVuDto? GetById(int id);
        ChucVuDto Create(ChucVuDto dto);
        ChucVuDto? Update(int id, ChucVuDto dto);
        bool Delete(int id);
    }
}
