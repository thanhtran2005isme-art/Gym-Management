using GymManagement.API.Admin.DTOs;
using GymManagement.DbHelper;

namespace GymManagement.API.Admin.Data
{
    public class ChucVuRepository : IChucVuRepository
    {
        private readonly IDbHelper _db;

        public ChucVuRepository(IDbHelper db)
        {
            _db = db;
        }

        public List<ChucVuDto> GetAll()
        {
            var dt = _db.ExecuteQuery("SELECT * FROM ChucVu ORDER BY MaChucVu");
            return MapList(dt);
        }

        public ChucVuDto? GetById(int id)
        {
            var dt = _db.ExecuteQuery("SELECT * FROM ChucVu WHERE MaChucVu = @Id", "@Id", id);
            return dt.Rows.Count == 0 ? null : MapToDto(dt.Rows[0]);
        }

        public int Create(ChucVuDto dto)
        {
            var sql = @"INSERT INTO ChucVu (TenChucVu, MoTa) VALUES (@Ten, @MoTa); SELECT SCOPE_IDENTITY();";
            var id = _db.ExecuteScalar(sql, "@Ten", dto.TenChucVu, "@MoTa", dto.MoTa);
            return Convert.ToInt32(id);
        }

        public bool Update(int id, ChucVuDto dto)
        {
            var sql = @"UPDATE ChucVu SET TenChucVu=@Ten, MoTa=@MoTa WHERE MaChucVu=@Id";
            return _db.ExecuteNonQuery(sql, "@Ten", dto.TenChucVu, "@MoTa", dto.MoTa, "@Id", id) > 0;
        }

        public bool Delete(int id)
        {
            return _db.ExecuteNonQuery("DELETE FROM ChucVu WHERE MaChucVu = @Id", "@Id", id) > 0;
        }

        private List<ChucVuDto> MapList(System.Data.DataTable dt)
        {
            var list = new List<ChucVuDto>();
            foreach (System.Data.DataRow row in dt.Rows)
                list.Add(MapToDto(row));
            return list;
        }

        private ChucVuDto MapToDto(System.Data.DataRow row)
        {
            return new ChucVuDto
            {
                MaChucVu = Convert.ToInt32(row["MaChucVu"]),
                TenChucVu = row["TenChucVu"].ToString()!,
                MoTa = row["MoTa"]?.ToString()
            };
        }
    }
}
