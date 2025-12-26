using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Data
{
    public interface INhanVienRepository
    {
        List<NhanVienDto> GetAll();
        NhanVienDto? GetById(int id);
        int Create(NhanVienDto dto);
        bool Update(int id, NhanVienDto dto);
        bool Delete(int id);
        List<NhanVienDto> Search(string keyword);
        List<NhanVienDto> GetByChucVu(int maChucVu);
        List<NhanVienDto> GetTrainers();
        (List<NhanVienDto> Items, int Total) GetPaged(int page, int pageSize);
    }
}
