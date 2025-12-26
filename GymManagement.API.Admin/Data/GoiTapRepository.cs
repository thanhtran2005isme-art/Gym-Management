using GymManagement.API.Admin.DTOs;
using GymManagement.DbHelper;

namespace GymManagement.API.Admin.Data
{
    public class GoiTapRepository : IGoiTapRepository
    {
        private readonly IDbHelper _db;

        public GoiTapRepository(IDbHelper db)
        {
            _db = db;
        }

        public List<GoiTapDto> GetAll()
        {
            var dt = _db.ExecuteQuery("SELECT * FROM GoiTap ORDER BY MaGoiTap");
            return MapList(dt);
        }

        public GoiTapDto? GetById(int id)
        {
            var dt = _db.ExecuteQuery("SELECT * FROM GoiTap WHERE MaGoiTap = @Id", "@Id", id);
            return dt.Rows.Count == 0 ? null : MapToDto(dt.Rows[0]);
        }

        public int Create(GoiTapDto dto)
        {
            var sql = @"INSERT INTO GoiTap (TenGoiTap, SoThang, SoLanTapToiDa, Gia, MoTa, TrangThai) 
                        VALUES (@Ten, @SoThang, @SoLan, @Gia, @MoTa, @TrangThai); SELECT SCOPE_IDENTITY();";
            var id = _db.ExecuteScalar(sql,
                "@Ten", dto.TenGoiTap, "@SoThang", dto.SoThang, "@SoLan", dto.SoLanTapToiDa,
                "@Gia", dto.Gia, "@MoTa", dto.MoTa, "@TrangThai", dto.TrangThai);
            return Convert.ToInt32(id);
        }

        public bool Update(int id, GoiTapDto dto)
        {
            var sql = @"UPDATE GoiTap SET TenGoiTap=@Ten, SoThang=@SoThang, SoLanTapToiDa=@SoLan, 
                        Gia=@Gia, MoTa=@MoTa, TrangThai=@TrangThai WHERE MaGoiTap=@Id";
            return _db.ExecuteNonQuery(sql,
                "@Ten", dto.TenGoiTap, "@SoThang", dto.SoThang, "@SoLan", dto.SoLanTapToiDa,
                "@Gia", dto.Gia, "@MoTa", dto.MoTa, "@TrangThai", dto.TrangThai, "@Id", id) > 0;
        }

        public bool Delete(int id)
        {
            return _db.ExecuteNonQuery("DELETE FROM GoiTap WHERE MaGoiTap = @Id", "@Id", id) > 0;
        }

        public List<GoiTapDto> GetActive()
        {
            var dt = _db.ExecuteQuery("SELECT * FROM GoiTap WHERE TrangThai = 1 ORDER BY MaGoiTap");
            return MapList(dt);
        }

        public List<GoiTapDto> Search(string keyword)
        {
            var sql = @"SELECT * FROM GoiTap WHERE TenGoiTap LIKE @Keyword OR MoTa LIKE @Keyword ORDER BY MaGoiTap";
            var dt = _db.ExecuteQuery(sql, "@Keyword", $"%{keyword}%");
            return MapList(dt);
        }

        private List<GoiTapDto> MapList(System.Data.DataTable dt)
        {
            var list = new List<GoiTapDto>();
            foreach (System.Data.DataRow row in dt.Rows)
                list.Add(MapToDto(row));
            return list;
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
