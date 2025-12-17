namespace MyWebAPI.Services.Interfaces
{
    using MyWebAPI.Models.DTO;

    public interface IChucVuService
    {
        Task<IEnumerable<ChucVuDto>> GetAllAsync();
        Task<ChucVuDto?> GetByIdAsync(int id);
        Task<ChucVuDto> CreateAsync(ChucVuDto dto);
        Task<ChucVuDto?> UpdateAsync(int id, ChucVuDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
