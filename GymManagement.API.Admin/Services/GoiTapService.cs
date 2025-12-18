using GymManagement.API.Admin.DTOs;
using GymManagement.DbHelper;

namespace GymManagement.API.Admin.Services
{
    public class GoiTapService : IGoiTapService
    {
        private readonly IDbHelper _db;

        public GoiTapService(IDbHelper db)
        {
            _db = db;
        }

        public async Task<IEnumerable<GoiTapDto>> GetAllAsync()
        {
            var dt = _db.ExecuteQuery("SELECT * FROM GoiTap ORDER BY MaGoiTap");
            var list = new List<GoiTapDto>();
            foreach (System.Data.DataRow row in dt.Rows)
            {
                list.Add(MapToDto(row));
            }
            return await Task.FromResult(list);
        }

        public async Task<GoiTapDto?> GetByIdAsync(int id)
        {
            var dt = _db.ExecuteQuery("SELECT * FROM GoiTap WHERE MaGoiTap = @Id", "@Id", id);
            if (dt.Rows.Count == 0) return null;
            return await Task.FromResult(MapToDto(dt.Rows[0]));
        }

        public async Task<GoiTapDto> CreateAsync(GoiTapDto dto)
        {
            if (dto.Gia <= 0) throw new ArgumentException("Giá phải lớn hơn 0");
            if (dto.SoThang <= 0) throw new ArgumentException("Số tháng phải lớn hơn 0");
            
            var sql = @"INSERT INTO GoiTap (TenGoiTap, SoThang, SoLanTapToiDa, Gia, MoTa, TrangThai) 
                        VALUES (@Ten, @SoThang, @SoLan, @Gia, @MoTa, @TrangThai); SELECT SCOPE_IDENTITY();";
            var id = _db.ExecuteScalar(sql,
                "@Ten", dto.TenGoiTap, "@SoThang", dto.SoThang, "@SoLan", dto.SoLanTapToiDa,
                "@Gia", dto.Gia, "@MoTa", dto.MoTa, "@TrangThai", dto.TrangThai);
            dto.MaGoiTap = Convert.ToInt32(id);
            return await Task.FromResult(dto);
        }

        public async Task<GoiTapDto?> UpdateAsync(int id, GoiTapDto dto)
        {
            var sql = @"UPDATE GoiTap SET TenGoiTap=@Ten, SoThang=@SoThang, SoLanTapToiDa=@SoLan, 
                        Gia=@Gia, MoTa=@MoTa, TrangThai=@TrangThai WHERE MaGoiTap=@Id";
            var rows = _db.ExecuteNonQuery(sql,
                "@Ten", dto.TenGoiTap, "@SoThang", dto.SoThang, "@SoLan", dto.SoLanTapToiDa,
                "@Gia", dto.Gia, "@MoTa", dto.MoTa, "@TrangThai", dto.TrangThai, "@Id", id);
            if (rows == 0) return null;
            dto.MaGoiTap = id;
            return await Task.FromResult(dto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var rows = _db.ExecuteNonQuery("DELETE FROM GoiTap WHERE MaGoiTap = @Id", "@Id", id);
            return await Task.FromResult(rows > 0);
        }

        private GoiTapDto MapToDto(System.Data.DataRow row)
        {
            return new GoiTapDto
            {
                MaGoiTap = Convert.ToInt32(row["MaGoiTap"]),
                TenGoiTap = row["TenGoiTap"].ToString()!,
                SoThang = Convert.ToInt32(row["SoThang"]),
                SoLanTapToiDa = row["SoLanTapToiDa"] == DBNull.Value ? null : Convert.ToInt32(row["SoLanTapToiDa"]),
                Gia = Convert.ToDecimal(row["Gia"]),
                MoTa = row["MoTa"]?.ToString(),
                TrangThai = Convert.ToByte(row["TrangThai"])
            };
        }
    }
}
