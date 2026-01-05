using GymManagement.API.Admin.DTOs;
using GymManagement.DbHelper;

namespace GymManagement.API.Admin.Data
{
    public class ThanhVienRepository : IThanhVienRepository
    {
        private readonly IDbHelper _db;

        public ThanhVienRepository(IDbHelper db)
        {
            _db = db;
        }

        public List<ThanhVienDto> GetAll()
        {
            var dt = _db.ExecuteQuery("SELECT * FROM ThanhVien ORDER BY MaThanhVien");
            return MapList(dt);
        }

        public ThanhVienDto? GetById(int id)
        {
            var dt = _db.ExecuteQuery("SELECT * FROM ThanhVien WHERE MaThanhVien = @Id", "@Id", id);
            return dt.Rows.Count == 0 ? null : MapToDto(dt.Rows[0]);
        }

        public int Create(ThanhVienDto dto)
        {
            var sql = @"INSERT INTO ThanhVien (MaThe, HoTen, NgaySinh, GioiTinh, SoDienThoai, Email, DiaChi, TrangThai) 
                        VALUES (@MaThe, @HoTen, @NgaySinh, @GioiTinh, @SDT, @Email, @DiaChi, @TrangThai); 
                        SELECT SCOPE_IDENTITY();";
            var id = _db.ExecuteScalar(sql,
                "@MaThe", dto.MaThe, "@HoTen", dto.HoTen, "@NgaySinh", dto.NgaySinh,
                "@GioiTinh", dto.GioiTinh, "@SDT", dto.SoDienThoai, "@Email", dto.Email,
                "@DiaChi", dto.DiaChi, "@TrangThai", dto.TrangThai);
            return Convert.ToInt32(id);
        }

        public bool Update(int id, ThanhVienDto dto)
        {
            var sql = @"UPDATE ThanhVien SET MaThe=@MaThe, HoTen=@HoTen, NgaySinh=@NgaySinh, 
                        GioiTinh=@GioiTinh, SoDienThoai=@SDT, Email=@Email, DiaChi=@DiaChi, TrangThai=@TrangThai 
                        WHERE MaThanhVien=@Id";
            return _db.ExecuteNonQuery(sql,
                "@MaThe", dto.MaThe, "@HoTen", dto.HoTen, "@NgaySinh", dto.NgaySinh,
                "@GioiTinh", dto.GioiTinh, "@SDT", dto.SoDienThoai, "@Email", dto.Email,
                "@DiaChi", dto.DiaChi, "@TrangThai", dto.TrangThai, "@Id", id) > 0;
        }

        public bool Delete(int id)
        {
            return _db.ExecuteNonQuery("DELETE FROM ThanhVien WHERE MaThanhVien = @Id", "@Id", id) > 0;
        }

        public List<ThanhVienDto> Search(string keyword)
        {
            var sql = @"SELECT * FROM ThanhVien 
                        WHERE HoTen LIKE @Keyword OR SoDienThoai LIKE @Keyword OR Email LIKE @Keyword OR MaThe LIKE @Keyword
                        ORDER BY MaThanhVien";
            var dt = _db.ExecuteQuery(sql, "@Keyword", $"%{keyword}%");
            return MapList(dt);
        }

        public List<ThanhVienDto> GetActive()
        {
            var dt = _db.ExecuteQuery("SELECT * FROM ThanhVien WHERE TrangThai = 1 ORDER BY MaThanhVien");
            return MapList(dt);
        }

        public (List<ThanhVienDto> Items, int Total) GetPaged(int page, int pageSize)
        {
            var offset = (page - 1) * pageSize;
            var sql = @"SELECT * FROM ThanhVien ORDER BY MaThanhVien OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";
            var dt = _db.ExecuteQuery(sql, "@Offset", offset, "@PageSize", pageSize);
            var countDt = _db.ExecuteQuery("SELECT COUNT(*) FROM ThanhVien");
            var total = Convert.ToInt32(countDt.Rows[0][0]);
            return (MapList(dt), total);
        }

        private List<ThanhVienDto> MapList(System.Data.DataTable dt)
        {
            var list = new List<ThanhVienDto>();
            foreach (System.Data.DataRow row in dt.Rows)
                list.Add(MapToDto(row));
            return list;
        }

        private ThanhVienDto MapToDto(System.Data.DataRow row)
        {
            return new ThanhVienDto
            {
                MaThanhVien = Convert.ToInt32(row["MaThanhVien"]),
                MaThe = row["MaThe"]?.ToString(),
                HoTen = row["HoTen"].ToString()!,
                NgaySinh = row["NgaySinh"] == DBNull.Value ? null : Convert.ToDateTime(row["NgaySinh"]),
                GioiTinh = row["GioiTinh"]?.ToString(),
                SoDienThoai = row["SoDienThoai"]?.ToString(),
                Email = row["Email"]?.ToString(),
                DiaChi = row["DiaChi"]?.ToString(),
                NgayDangKy = Convert.ToDateTime(row["NgayDangKy"]),
                TrangThai = Convert.ToByte(row["TrangThai"])
            };
        }
    }
}
