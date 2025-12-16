using GymManagement.API.Admin.DTOs;
using GymManagement.DbHelper;

namespace GymManagement.API.Admin.Services
{
    public class ThanhVienService : IThanhVienService
    {
        private readonly IDbHelper _db;

        public ThanhVienService(IDbHelper db)
        {
            _db = db;
        }

        public async Task<IEnumerable<ThanhVienDto>> GetAllAsync()
        {
            var dt = _db.ExecuteQuery("SELECT * FROM ThanhVien ORDER BY MaThanhVien");
            var list = new List<ThanhVienDto>();
            foreach (System.Data.DataRow row in dt.Rows)
            {
                list.Add(MapToDto(row));
            }
            return await Task.FromResult(list);
        }

        public async Task<ThanhVienDto?> GetByIdAsync(int id)
        {
            var dt = _db.ExecuteQuery("SELECT * FROM ThanhVien WHERE MaThanhVien = @Id", "@Id", id);
            if (dt.Rows.Count == 0) return null;
            return await Task.FromResult(MapToDto(dt.Rows[0]));
        }

        public async Task<ThanhVienDto> CreateAsync(ThanhVienDto dto)
        {
            var sql = @"INSERT INTO ThanhVien (MaThe, HoTen, NgaySinh, GioiTinh, SoDienThoai, Email, DiaChi, TrangThai) 
                        VALUES (@MaThe, @HoTen, @NgaySinh, @GioiTinh, @SDT, @Email, @DiaChi, @TrangThai); 
                        SELECT SCOPE_IDENTITY();";
            var id = _db.ExecuteScalar(sql,
                "@MaThe", dto.MaThe, "@HoTen", dto.HoTen, "@NgaySinh", dto.NgaySinh,
                "@GioiTinh", dto.GioiTinh, "@SDT", dto.SoDienThoai, "@Email", dto.Email,
                "@DiaChi", dto.DiaChi, "@TrangThai", dto.TrangThai);
            dto.MaThanhVien = Convert.ToInt32(id);
            return await Task.FromResult(dto);
        }

        public async Task<ThanhVienDto?> UpdateAsync(int id, ThanhVienDto dto)
        {
            var sql = @"UPDATE ThanhVien SET MaThe=@MaThe, HoTen=@HoTen, NgaySinh=@NgaySinh, 
                        GioiTinh=@GioiTinh, SoDienThoai=@SDT, Email=@Email, DiaChi=@DiaChi, TrangThai=@TrangThai 
                        WHERE MaThanhVien=@Id";
            var rows = _db.ExecuteNonQuery(sql,
                "@MaThe", dto.MaThe, "@HoTen", dto.HoTen, "@NgaySinh", dto.NgaySinh,
                "@GioiTinh", dto.GioiTinh, "@SDT", dto.SoDienThoai, "@Email", dto.Email,
                "@DiaChi", dto.DiaChi, "@TrangThai", dto.TrangThai, "@Id", id);
            if (rows == 0) return null;
            dto.MaThanhVien = id;
            return await Task.FromResult(dto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var rows = _db.ExecuteNonQuery("DELETE FROM ThanhVien WHERE MaThanhVien = @Id", "@Id", id);
            return await Task.FromResult(rows > 0);
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
