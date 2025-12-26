using GymManagement.API.Admin.DTOs;
using GymManagement.DbHelper;

namespace GymManagement.API.Admin.Data
{
    public class NhanVienRepository : INhanVienRepository
    {
        private readonly IDbHelper _db;

        public NhanVienRepository(IDbHelper db)
        {
            _db = db;
        }

        public List<NhanVienDto> GetAll()
        {
            var sql = @"SELECT nv.*, cv.TenChucVu FROM NhanVien nv 
                        LEFT JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu ORDER BY nv.MaNhanVien";
            var dt = _db.ExecuteQuery(sql);
            return MapList(dt);
        }

        public NhanVienDto? GetById(int id)
        {
            var sql = @"SELECT nv.*, cv.TenChucVu FROM NhanVien nv 
                        LEFT JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu WHERE nv.MaNhanVien = @Id";
            var dt = _db.ExecuteQuery(sql, "@Id", id);
            return dt.Rows.Count == 0 ? null : MapToDto(dt.Rows[0]);
        }

        public int Create(NhanVienDto dto)
        {
            var sql = @"INSERT INTO NhanVien (HoTen, NgaySinh, GioiTinh, SoDienThoai, Email, DiaChi, MaChucVu, TrangThai) 
                        VALUES (@HoTen, @NgaySinh, @GioiTinh, @SDT, @Email, @DiaChi, @MaChucVu, @TrangThai); 
                        SELECT SCOPE_IDENTITY();";
            var id = _db.ExecuteScalar(sql,
                "@HoTen", dto.HoTen, "@NgaySinh", dto.NgaySinh, "@GioiTinh", dto.GioiTinh,
                "@SDT", dto.SoDienThoai, "@Email", dto.Email, "@DiaChi", dto.DiaChi,
                "@MaChucVu", dto.MaChucVu, "@TrangThai", dto.TrangThai);
            return Convert.ToInt32(id);
        }

        public bool Update(int id, NhanVienDto dto)
        {
            var sql = @"UPDATE NhanVien SET HoTen=@HoTen, NgaySinh=@NgaySinh, GioiTinh=@GioiTinh, 
                        SoDienThoai=@SDT, Email=@Email, DiaChi=@DiaChi, MaChucVu=@MaChucVu, TrangThai=@TrangThai 
                        WHERE MaNhanVien=@Id";
            return _db.ExecuteNonQuery(sql,
                "@HoTen", dto.HoTen, "@NgaySinh", dto.NgaySinh, "@GioiTinh", dto.GioiTinh,
                "@SDT", dto.SoDienThoai, "@Email", dto.Email, "@DiaChi", dto.DiaChi,
                "@MaChucVu", dto.MaChucVu, "@TrangThai", dto.TrangThai, "@Id", id) > 0;
        }

        public bool Delete(int id)
        {
            return _db.ExecuteNonQuery("DELETE FROM NhanVien WHERE MaNhanVien = @Id", "@Id", id) > 0;
        }

        public List<NhanVienDto> Search(string keyword)
        {
            var sql = @"SELECT nv.*, cv.TenChucVu FROM NhanVien nv 
                        LEFT JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu 
                        WHERE nv.HoTen LIKE @Keyword OR nv.SoDienThoai LIKE @Keyword OR nv.Email LIKE @Keyword
                        ORDER BY nv.MaNhanVien";
            var dt = _db.ExecuteQuery(sql, "@Keyword", $"%{keyword}%");
            return MapList(dt);
        }

        public List<NhanVienDto> GetByChucVu(int maChucVu)
        {
            var sql = @"SELECT nv.*, cv.TenChucVu FROM NhanVien nv 
                        LEFT JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu 
                        WHERE nv.MaChucVu = @MaChucVu ORDER BY nv.MaNhanVien";
            var dt = _db.ExecuteQuery(sql, "@MaChucVu", maChucVu);
            return MapList(dt);
        }

        public List<NhanVienDto> GetTrainers()
        {
            var sql = @"SELECT nv.*, cv.TenChucVu FROM NhanVien nv 
                        INNER JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu 
                        WHERE cv.TenChucVu = N'Huấn luyện viên' AND nv.TrangThai = 1
                        ORDER BY nv.MaNhanVien";
            var dt = _db.ExecuteQuery(sql);
            return MapList(dt);
        }

        public (List<NhanVienDto> Items, int Total) GetPaged(int page, int pageSize)
        {
            var offset = (page - 1) * pageSize;
            var sql = @"SELECT nv.*, cv.TenChucVu FROM NhanVien nv 
                        LEFT JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu 
                        ORDER BY nv.MaNhanVien OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";
            var dt = _db.ExecuteQuery(sql, "@Offset", offset, "@PageSize", pageSize);
            var countDt = _db.ExecuteQuery("SELECT COUNT(*) FROM NhanVien");
            var total = Convert.ToInt32(countDt.Rows[0][0]);
            return (MapList(dt), total);
        }

        private List<NhanVienDto> MapList(System.Data.DataTable dt)
        {
            var list = new List<NhanVienDto>();
            foreach (System.Data.DataRow row in dt.Rows)
                list.Add(MapToDto(row));
            return list;
        }

        private NhanVienDto MapToDto(System.Data.DataRow row)
        {
            return new NhanVienDto
            {
                MaNhanVien = Convert.ToInt32(row["MaNhanVien"]),
                HoTen = row["HoTen"].ToString()!,
                NgaySinh = row["NgaySinh"] == DBNull.Value ? null : Convert.ToDateTime(row["NgaySinh"]),
                GioiTinh = row["GioiTinh"]?.ToString(),
                SoDienThoai = row["SoDienThoai"]?.ToString(),
                Email = row["Email"]?.ToString(),
                DiaChi = row["DiaChi"]?.ToString(),
                NgayVaoLam = row["NgayVaoLam"] == DBNull.Value ? null : Convert.ToDateTime(row["NgayVaoLam"]),
                MaChucVu = row["MaChucVu"] == DBNull.Value ? null : Convert.ToInt32(row["MaChucVu"]),
                TenChucVu = row["TenChucVu"]?.ToString(),
                TrangThai = Convert.ToByte(row["TrangThai"])
            };
        }
    }
}
