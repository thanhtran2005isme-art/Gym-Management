using GymManagement.API.Admin.DTOs;
using GymManagement.DbHelper;
using System.Data;

namespace GymManagement.API.Admin.Data
{
    public class GoiPTRepository : IGoiPTRepository
    {
        private readonly IDbHelper _dbHelper;

        public GoiPTRepository(IDbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public IEnumerable<GoiPTDto> GetAll()
        {
            var sql = "SELECT MaGoiPT, TenGoiPT, SoBuoi, Gia, MoTa, TrangThai FROM dbo.GoiPT ORDER BY MaGoiPT DESC";
            var dt = _dbHelper.ExecuteQuery(sql);
            return MapToList(dt);
        }

        public GoiPTDto? GetById(int id)
        {
            var sql = "SELECT MaGoiPT, TenGoiPT, SoBuoi, Gia, MoTa, TrangThai FROM dbo.GoiPT WHERE MaGoiPT = @MaGoiPT";
            var parameters = new Dictionary<string, object> { { "@MaGoiPT", id } };
            var dt = _dbHelper.ExecuteQuery(sql, parameters);
            return dt.Rows.Count > 0 ? MapToDto(dt.Rows[0]) : null;
        }

        public GoiPTDto Create(GoiPTDto dto)
        {
            var sql = @"INSERT INTO dbo.GoiPT (TenGoiPT, SoBuoi, Gia, MoTa, TrangThai)
                       VALUES (@TenGoiPT, @SoBuoi, @Gia, @MoTa, @TrangThai);
                       SELECT CAST(SCOPE_IDENTITY() AS INT);";
            
            var parameters = new Dictionary<string, object>
            {
                { "@TenGoiPT", dto.TenGoiPT },
                { "@SoBuoi", dto.SoBuoi },
                { "@Gia", dto.Gia },
                { "@MoTa", (object?)dto.MoTa ?? DBNull.Value },
                { "@TrangThai", dto.TrangThai }
            };

            var id = _dbHelper.ExecuteScalar(sql, parameters);
            dto.MaGoiPT = Convert.ToInt32(id);
            return dto;
        }

        public GoiPTDto? Update(int id, GoiPTDto dto)
        {
            var sql = @"UPDATE dbo.GoiPT 
                       SET TenGoiPT = @TenGoiPT, SoBuoi = @SoBuoi, Gia = @Gia, 
                           MoTa = @MoTa, TrangThai = @TrangThai
                       WHERE MaGoiPT = @MaGoiPT";
            
            var parameters = new Dictionary<string, object>
            {
                { "@MaGoiPT", id },
                { "@TenGoiPT", dto.TenGoiPT },
                { "@SoBuoi", dto.SoBuoi },
                { "@Gia", dto.Gia },
                { "@MoTa", (object?)dto.MoTa ?? DBNull.Value },
                { "@TrangThai", dto.TrangThai }
            };

            var rowsAffected = _dbHelper.ExecuteNonQuery(sql, parameters);
            return rowsAffected > 0 ? GetById(id) : null;
        }

        public bool Delete(int id)
        {
            var sql = "DELETE FROM dbo.GoiPT WHERE MaGoiPT = @MaGoiPT";
            var parameters = new Dictionary<string, object> { { "@MaGoiPT", id } };
            return _dbHelper.ExecuteNonQuery(sql, parameters) > 0;
        }

        public IEnumerable<GoiPTDto> GetActive()
        {
            var sql = "SELECT MaGoiPT, TenGoiPT, SoBuoi, Gia, MoTa, TrangThai FROM dbo.GoiPT WHERE TrangThai = 1 ORDER BY SoBuoi";
            var dt = _dbHelper.ExecuteQuery(sql);
            return MapToList(dt);
        }

        public IEnumerable<GoiPTDto> Search(string keyword)
        {
            var sql = @"SELECT MaGoiPT, TenGoiPT, SoBuoi, Gia, MoTa, TrangThai 
                       FROM dbo.GoiPT 
                       WHERE TenGoiPT LIKE @Keyword OR MoTa LIKE @Keyword
                       ORDER BY MaGoiPT DESC";
            
            var parameters = new Dictionary<string, object> { { "@Keyword", $"%{keyword}%" } };
            var dt = _dbHelper.ExecuteQuery(sql, parameters);
            return MapToList(dt);
        }

        private GoiPTDto MapToDto(DataRow row)
        {
            return new GoiPTDto
            {
                MaGoiPT = Convert.ToInt32(row["MaGoiPT"]),
                TenGoiPT = row["TenGoiPT"].ToString()!,
                SoBuoi = Convert.ToInt32(row["SoBuoi"]),
                Gia = Convert.ToDecimal(row["Gia"]),
                MoTa = row["MoTa"] != DBNull.Value ? row["MoTa"].ToString() : null,
                TrangThai = Convert.ToByte(row["TrangThai"])
            };
        }

        private List<GoiPTDto> MapToList(DataTable dt)
        {
            var list = new List<GoiPTDto>();
            foreach (DataRow row in dt.Rows)
            {
                list.Add(MapToDto(row));
            }
            return list;
        }
    }
}
