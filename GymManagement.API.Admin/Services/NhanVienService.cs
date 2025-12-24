using Microsoft.Data.SqlClient;
using GymManagement.Shared.DTOs;

namespace GymManagement.API.Admin.Services
{
    public class NhanVienService : INhanVienService
    {
        private readonly string _connectionString;

        public NhanVienService(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<NhanVienDto>> GetAllAsync()
        {
            var list = new List<NhanVienDto>();
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                @"SELECT nv.MaNhanVien, nv.HoTen, nv.SoDienThoai, nv.Email, nv.MaChucVu, cv.TenChucVu, nv.NgayVaoLam, nv.TrangThai 
                  FROM NhanVien nv 
                  LEFT JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu", conn);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(MapToDto(reader));
            }
            return list;
        }

        public async Task<NhanVienDto?> GetByIdAsync(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                @"SELECT nv.MaNhanVien, nv.HoTen, nv.SoDienThoai, nv.Email, nv.MaChucVu, cv.TenChucVu, nv.NgayVaoLam, nv.TrangThai 
                  FROM NhanVien nv 
                  LEFT JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu 
                  WHERE nv.MaNhanVien = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return MapToDto(reader);
            }
            return null;
        }

        public async Task<NhanVienDto> CreateAsync(NhanVienDto dto)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                @"INSERT INTO NhanVien (HoTen, SoDienThoai, Email, MaChucVu, NgayVaoLam, TrangThai) 
                  OUTPUT INSERTED.MaNhanVien 
                  VALUES (@HoTen, @SoDienThoai, @Email, @MaChucVu, @NgayVaoLam, @TrangThai)", conn);

            cmd.Parameters.AddWithValue("@HoTen", dto.HoTen);
            cmd.Parameters.AddWithValue("@SoDienThoai", (object?)dto.SoDienThoai ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Email", (object?)dto.Email ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@MaChucVu", (object?)dto.MaChucVu ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@NgayVaoLam", dto.NgayVaoLam ?? DateTime.Now);
            cmd.Parameters.AddWithValue("@TrangThai", dto.TrangThai);

            await conn.OpenAsync();
            dto.MaNhanVien = (int)await cmd.ExecuteScalarAsync();
            return dto;
        }

        public async Task<NhanVienDto?> UpdateAsync(int id, NhanVienDto dto)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                @"UPDATE NhanVien SET HoTen = @HoTen, SoDienThoai = @SoDienThoai, Email = @Email, 
                  MaChucVu = @MaChucVu, NgayVaoLam = @NgayVaoLam, TrangThai = @TrangThai 
                  WHERE MaNhanVien = @Id", conn);

            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@HoTen", dto.HoTen);
            cmd.Parameters.AddWithValue("@SoDienThoai", (object?)dto.SoDienThoai ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Email", (object?)dto.Email ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@MaChucVu", (object?)dto.MaChucVu ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@NgayVaoLam", (object?)dto.NgayVaoLam ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@TrangThai", dto.TrangThai);

            await conn.OpenAsync();
            var rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0) return null;
            dto.MaNhanVien = id;
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("DELETE FROM NhanVien WHERE MaNhanVien = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);

            await conn.OpenAsync();
            var rows = await cmd.ExecuteNonQueryAsync();
            return rows > 0;
        }

        private static NhanVienDto MapToDto(SqlDataReader reader)
        {
            return new NhanVienDto
            {
                MaNhanVien = reader.GetInt32(0),
                HoTen = reader.GetString(1),
                SoDienThoai = reader.IsDBNull(2) ? null : reader.GetString(2),
                Email = reader.IsDBNull(3) ? null : reader.GetString(3),
                MaChucVu = reader.IsDBNull(4) ? null : reader.GetInt32(4),
                TenChucVu = reader.IsDBNull(5) ? null : reader.GetString(5),
                NgayVaoLam = reader.IsDBNull(6) ? null : reader.GetDateTime(6),
                TrangThai = reader.GetBoolean(7)
            };
        }
    }
}
