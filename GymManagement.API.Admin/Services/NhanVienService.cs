using GymManagement.API.Admin.DTOs;
using GymManagement.DbHelper;

namespace GymManagement.API.Admin.Services
{
    public class NhanVienService : INhanVienService
    {
        private readonly IDbHelper _db;

        public NhanVienService(IDbHelper db)
        {
            _db = db;
        }

        public async Task<IEnumerable<NhanVienDto>> GetAllAsync()
        {
            var sql = @"SELECT nv.*, cv.TenChucVu FROM NhanVien nv 
                        LEFT JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu ORDER BY nv.MaNhanVien";
            var dt = _db.ExecuteQuery(sql);
            var list = new List<NhanVienDto>();
            foreach (System.Data.DataRow row in dt.Rows)
            {
                list.Add(MapToDto(row));
            }
            return await Task.FromResult(list);
        }

        public async Task<NhanVienDto?> GetByIdAsync(int id)
        {
            var sql = @"SELECT nv.*, cv.TenChucVu FROM NhanVien nv 
                        LEFT JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu WHERE nv.MaNhanVien = @Id";
            var dt = _db.ExecuteQuery(sql, "@Id", id);
            if (dt.Rows.Count == 0) return null;
            return await Task.FromResult(MapToDto(dt.Rows[0]));
        }

        public async Task<NhanVienDto> CreateAsync(NhanVienDto dto)
        {
            var sql = @"INSERT INTO NhanVien (HoTen, NgaySinh, GioiTinh, SoDienThoai, Email, DiaChi, MaChucVu, TrangThai) 
                        VALUES (@HoTen, @NgaySinh, @GioiTinh, @SDT, @Email, @DiaChi, @MaChucVu, @TrangThai); 
                        SELECT SCOPE_IDENTITY();";
            var id = _db.ExecuteScalar(sql,
                "@HoTen", dto.HoTen, "@NgaySinh", dto.NgaySinh, "@GioiTinh", dto.GioiTinh,
                "@SDT", dto.SoDienThoai, "@Email", dto.Email, "@DiaChi", dto.DiaChi,
                "@MaChucVu", dto.MaChucVu, "@TrangThai", dto.TrangThai);
            dto.MaNhanVien = Convert.ToInt32(id);
            return await Task.FromResult(dto);
        }

        public async Task<NhanVienDto?> UpdateAsync(int id, NhanVienDto dto)
        {
            var sql = @"UPDATE NhanVien SET HoTen=@HoTen, NgaySinh=@NgaySinh, GioiTinh=@GioiTinh, 
                        SoDienThoai=@SDT, Email=@Email, DiaChi=@DiaChi, MaChucVu=@MaChucVu, TrangThai=@TrangThai 
                        WHERE MaNhanVien=@Id";
            var rows = _db.ExecuteNonQuery(sql,
                "@HoTen", dto.HoTen, "@NgaySinh", dto.NgaySinh, "@GioiTinh", dto.GioiTinh,
                "@SDT", dto.SoDienThoai, "@Email", dto.Email, "@DiaChi", dto.DiaChi,
                "@MaChucVu", dto.MaChucVu, "@TrangThai", dto.TrangThai, "@Id", id);
            if (rows == 0) return null;
            dto.MaNhanVien = id;
            return await Task.FromResult(dto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var rows = _db.ExecuteNonQuery("DELETE FROM NhanVien WHERE MaNhanVien = @Id", "@Id", id);
            return await Task.FromResult(rows > 0);
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
