using GymManagement.API.Admin.DTOs;
using GymManagement.DbHelper;

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
            var dt = _db.ExecuteQuery("SELECT MaChucVu, TenChucVu, MoTa FROM ChucVu ORDER BY MaChucVu");
            var list = new List<ChucVuDto>();
            foreach (System.Data.DataRow row in dt.Rows)
            {
                list.Add(new ChucVuDto
                {
                    MaChucVu = Convert.ToInt32(row["MaChucVu"]),
                    TenChucVu = row["TenChucVu"].ToString()!,
                    MoTa = row["MoTa"]?.ToString()
                });
            }
            return await Task.FromResult(list);
        }

        public async Task<ChucVuDto?> GetByIdAsync(int id)
        {
            var dt = _db.ExecuteQuery("SELECT * FROM ChucVu WHERE MaChucVu = @Id", "@Id", id);
            if (dt.Rows.Count == 0) return null;
            var row = dt.Rows[0];
            return await Task.FromResult(new ChucVuDto
            {
                MaChucVu = Convert.ToInt32(row["MaChucVu"]),
                TenChucVu = row["TenChucVu"].ToString()!,
                MoTa = row["MoTa"]?.ToString()
            });
        }

        public async Task<ChucVuDto> CreateAsync(ChucVuDto dto)
        {
            var id = _db.ExecuteScalar(
                "INSERT INTO ChucVu (TenChucVu, MoTa) VALUES (@Ten, @MoTa); SELECT SCOPE_IDENTITY();",
                "@Ten", dto.TenChucVu, "@MoTa", dto.MoTa);
            dto.MaChucVu = Convert.ToInt32(id);
            return await Task.FromResult(dto);
        }

        public async Task<ChucVuDto?> UpdateAsync(int id, ChucVuDto dto)
        {
            var rows = _db.ExecuteNonQuery(
                "UPDATE ChucVu SET TenChucVu = @Ten, MoTa = @MoTa WHERE MaChucVu = @Id",
                "@Ten", dto.TenChucVu, "@MoTa", dto.MoTa, "@Id", id);
            if (rows == 0) return null;
            dto.MaChucVu = id;
            return await Task.FromResult(dto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var rows = _db.ExecuteNonQuery("DELETE FROM ChucVu WHERE MaChucVu = @Id", "@Id", id);
            return await Task.FromResult(rows > 0);
        }
    }
}
