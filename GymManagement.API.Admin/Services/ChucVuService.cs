using System.Data;
using GymManagement.DbHelper;
using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Services
{
    public class ChucVuService : IChucVuService
    {
        private readonly IDbHelper _db;

        public ChucVuService(IDbHelper db)
        {
            _db = db;
        }

        public async Task<IEnumerable<ChucVuDto>> GetAllAsync()
        {
            var dt = await _db.ExecuteQueryAsync("SELECT MaChucVu, TenChucVu, MoTa FROM ChucVu");
            return dt.AsEnumerable().Select(row => new ChucVuDto
            {
                MaChucVu = row.Field<int>("MaChucVu"),
                TenChucVu = row.Field<string>("TenChucVu")!,
                MoTa = row.Field<string?>("MoTa")
            });
        }

        public async Task<ChucVuDto?> GetByIdAsync(int id)
        {
            var dt = await _db.ExecuteQueryAsync(
                "SELECT MaChucVu, TenChucVu, MoTa FROM ChucVu WHERE MaChucVu = @Id",
                new Dictionary<string, object> { { "@Id", id } });
            
            var row = dt.AsEnumerable().FirstOrDefault();
            if (row == null) return null;

            return new ChucVuDto
            {
                MaChucVu = row.Field<int>("MaChucVu"),
                TenChucVu = row.Field<string>("TenChucVu")!,
                MoTa = row.Field<string?>("MoTa")
            };
        }

        public async Task<ChucVuDto> CreateAsync(ChucVuDto dto)
        {
            var id = await _db.ExecuteScalarAsync(
                "INSERT INTO ChucVu (TenChucVu, MoTa) OUTPUT INSERTED.MaChucVu VALUES (@TenChucVu, @MoTa)",
                new Dictionary<string, object>
                {
                    { "@TenChucVu", dto.TenChucVu },
                    { "@MoTa", dto.MoTa! }
                });
            dto.MaChucVu = (int)id!;
            return dto;
        }

        public async Task<ChucVuDto?> UpdateAsync(int id, ChucVuDto dto)
        {
            var rows = await _db.ExecuteNonQueryAsync(
                "UPDATE ChucVu SET TenChucVu = @TenChucVu, MoTa = @MoTa WHERE MaChucVu = @Id",
                new Dictionary<string, object>
                {
                    { "@Id", id },
                    { "@TenChucVu", dto.TenChucVu },
                    { "@MoTa", dto.MoTa! }
                });
            if (rows == 0) return null;
            dto.MaChucVu = id;
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var rows = await _db.ExecuteNonQueryAsync(
                "DELETE FROM ChucVu WHERE MaChucVu = @Id",
                new Dictionary<string, object> { { "@Id", id } });
            return rows > 0;
        }
    }
}
