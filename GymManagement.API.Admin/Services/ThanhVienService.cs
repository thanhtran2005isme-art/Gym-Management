using Microsoft.Data.SqlClient;
using GymManagement.Shared.DTOs;

namespace GymManagement.API.Admin.Services
{
    public class ThanhVienService : IThanhVienService
    {
        private readonly string _connectionString;

        public ThanhVienService(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<ThanhVienDto>> GetAllAsync()
        {
            var list = new List<ThanhVienDto>();
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                "SELECT MaThanhVien, HoTen, SoDienThoai, Email, NgaySinh, GioiTinh, DiaChi, NgayDangKy, TrangThai FROM ThanhVien", conn);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(MapToDto(reader));
            }
            return list;
        }

        public async Task<ThanhVienDto?> GetByIdAsync(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                "SELECT MaThanhVien, HoTen, SoDienThoai, Email, NgaySinh, GioiTinh, DiaChi, NgayDangKy, TrangThai FROM ThanhVien WHERE MaThanhVien = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return MapToDto(reader);
            }
            return null;
        }

        public async Task<ThanhVienDto> CreateAsync(ThanhVienDto dto)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                @"INSERT INTO ThanhVien (HoTen, SoDienThoai, Email, NgaySinh, GioiTinh, DiaChi, NgayDangKy, TrangThai) 
                  OUTPUT INSERTED.MaThanhVien 
                  VALUES (@HoTen, @SoDienThoai, @Email, @NgaySinh, @GioiTinh, @DiaChi, @NgayDangKy, @TrangThai)", conn);

            cmd.Parameters.AddWithValue("@HoTen", dto.HoTen);
            cmd.Parameters.AddWithValue("@SoDienThoai", (object?)dto.SoDienThoai ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Email", (object?)dto.Email ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@NgaySinh", (object?)dto.NgaySinh ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@GioiTinh", (object?)dto.GioiTinh ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@DiaChi", (object?)dto.DiaChi ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@NgayDangKy", DateTime.Now);
            cmd.Parameters.AddWithValue("@TrangThai", true);

            await conn.OpenAsync();
            dto.MaThanhVien = (int)await cmd.ExecuteScalarAsync();
            dto.NgayDangKy = DateTime.Now;
            dto.TrangThai = true;
            return dto;
        }

        public async Task<ThanhVienDto?> UpdateAsync(int id, ThanhVienDto dto)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                @"UPDATE ThanhVien SET HoTen = @HoTen, SoDienThoai = @SoDienThoai, Email = @Email, 
                  NgaySinh = @NgaySinh, GioiTinh = @GioiTinh, DiaChi = @DiaChi, TrangThai = @TrangThai 
                  WHERE MaThanhVien = @Id", conn);

            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@HoTen", dto.HoTen);
            cmd.Parameters.AddWithValue("@SoDienThoai", (object?)dto.SoDienThoai ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Email", (object?)dto.Email ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@NgaySinh", (object?)dto.NgaySinh ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@GioiTinh", (object?)dto.GioiTinh ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@DiaChi", (object?)dto.DiaChi ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@TrangThai", dto.TrangThai);

            await conn.OpenAsync();
            var rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0) return null;
            dto.MaThanhVien = id;
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("DELETE FROM ThanhVien WHERE MaThanhVien = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);

            await conn.OpenAsync();
            var rows = await cmd.ExecuteNonQueryAsync();
            return rows > 0;
        }

        private static ThanhVienDto MapToDto(SqlDataReader reader)
        {
            return new ThanhVienDto
            {
                MaThanhVien = reader.GetInt32(0),
                HoTen = reader.GetString(1),
                SoDienThoai = reader.IsDBNull(2) ? null : reader.GetString(2),
                Email = reader.IsDBNull(3) ? null : reader.GetString(3),
                NgaySinh = reader.IsDBNull(4) ? null : reader.GetDateTime(4),
                GioiTinh = reader.IsDBNull(5) ? null : reader.GetString(5),
                DiaChi = reader.IsDBNull(6) ? null : reader.GetString(6),
                NgayDangKy = reader.GetDateTime(7),
                TrangThai = reader.GetBoolean(8)
            };
        }
    }
}
