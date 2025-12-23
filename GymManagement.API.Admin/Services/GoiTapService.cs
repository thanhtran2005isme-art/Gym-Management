using Microsoft.Data.SqlClient;
using GymManagement.Shared.DTOs;

namespace GymManagement.API.Admin.Services
{
    public class GoiTapService : IGoiTapService
    {
        private readonly string _connectionString;

        public GoiTapService(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<GoiTapDto>> GetAllAsync()
        {
            var list = new List<GoiTapDto>();
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                "SELECT MaGoiTap, TenGoiTap, SoThang, SoLanTapToiDa, Gia, MoTa, TrangThai FROM GoiTap", conn);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(MapToDto(reader));
            }
            return list;
        }

        public async Task<GoiTapDto?> GetByIdAsync(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                "SELECT MaGoiTap, TenGoiTap, SoThang, SoLanTapToiDa, Gia, MoTa, TrangThai FROM GoiTap WHERE MaGoiTap = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return MapToDto(reader);
            }
            return null;
        }

        public async Task<GoiTapDto> CreateAsync(GoiTapDto dto)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                @"INSERT INTO GoiTap (TenGoiTap, SoThang, SoLanTapToiDa, Gia, MoTa, TrangThai) 
                  OUTPUT INSERTED.MaGoiTap 
                  VALUES (@TenGoiTap, @SoThang, @SoLanTapToiDa, @Gia, @MoTa, @TrangThai)", conn);

            cmd.Parameters.AddWithValue("@TenGoiTap", dto.TenGoiTap);
            cmd.Parameters.AddWithValue("@SoThang", dto.SoThang);
            cmd.Parameters.AddWithValue("@SoLanTapToiDa", (object?)dto.SoLanTapToiDa ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Gia", dto.Gia);
            cmd.Parameters.AddWithValue("@MoTa", (object?)dto.MoTa ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@TrangThai", dto.TrangThai);

            await conn.OpenAsync();
            dto.MaGoiTap = (int)await cmd.ExecuteScalarAsync();
            return dto;
        }

        public async Task<GoiTapDto?> UpdateAsync(int id, GoiTapDto dto)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                @"UPDATE GoiTap SET TenGoiTap = @TenGoiTap, SoThang = @SoThang, SoLanTapToiDa = @SoLanTapToiDa, 
                  Gia = @Gia, MoTa = @MoTa, TrangThai = @TrangThai 
                  WHERE MaGoiTap = @Id", conn);

            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@TenGoiTap", dto.TenGoiTap);
            cmd.Parameters.AddWithValue("@SoThang", dto.SoThang);
            cmd.Parameters.AddWithValue("@SoLanTapToiDa", (object?)dto.SoLanTapToiDa ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Gia", dto.Gia);
            cmd.Parameters.AddWithValue("@MoTa", (object?)dto.MoTa ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@TrangThai", dto.TrangThai);

            await conn.OpenAsync();
            var rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0) return null;
            dto.MaGoiTap = id;
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("DELETE FROM GoiTap WHERE MaGoiTap = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);

            await conn.OpenAsync();
            var rows = await cmd.ExecuteNonQueryAsync();
            return rows > 0;
        }

        private static GoiTapDto MapToDto(SqlDataReader reader)
        {
            return new GoiTapDto
            {
                MaGoiTap = reader.GetInt32(0),
                TenGoiTap = reader.GetString(1),
                SoThang = reader.GetInt32(2),
                SoLanTapToiDa = reader.IsDBNull(3) ? null : reader.GetInt32(3),
                Gia = reader.GetDecimal(4),
                MoTa = reader.IsDBNull(5) ? null : reader.GetString(5),
                TrangThai = reader.GetByte(6)
            };
        }
    }
}
