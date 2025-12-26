using Microsoft.Data.SqlClient;
using GymManagement.Shared.DTOs;
using GymManagement.Shared.Entities;

namespace GymManagement.API.Admin.Services
{
    public class ChucVuService : IChucVuService
    {
        private readonly string _connectionString;

        public ChucVuService(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<ChucVuDto>> GetAllAsync()
        {
            var list = new List<ChucVuDto>();
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SELECT MaChucVu, TenChucVu, MoTa FROM ChucVu", conn);
            
            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            
            while (await reader.ReadAsync())
            {
                list.Add(new ChucVuDto
                {
                    MaChucVu = reader.GetInt32(0),
                    TenChucVu = reader.GetString(1),
                    MoTa = reader.IsDBNull(2) ? null : reader.GetString(2)
                });
            }
            return list;
        }

        public async Task<ChucVuDto?> GetByIdAsync(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("SELECT MaChucVu, TenChucVu, MoTa FROM ChucVu WHERE MaChucVu = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);
            
            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            
            if (await reader.ReadAsync())
            {
                return new ChucVuDto
                {
                    MaChucVu = reader.GetInt32(0),
                    TenChucVu = reader.GetString(1),
                    MoTa = reader.IsDBNull(2) ? null : reader.GetString(2)
                };
            }
            return null;
        }

        public async Task<ChucVuDto> CreateAsync(ChucVuDto dto)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                "INSERT INTO ChucVu (TenChucVu, MoTa) OUTPUT INSERTED.MaChucVu VALUES (@TenChucVu, @MoTa)", conn);
            
            cmd.Parameters.AddWithValue("@TenChucVu", dto.TenChucVu);
            cmd.Parameters.AddWithValue("@MoTa", (object?)dto.MoTa ?? DBNull.Value);
            
            await conn.OpenAsync();
            dto.MaChucVu = (int)await cmd.ExecuteScalarAsync();
            return dto;
        }

        public async Task<ChucVuDto?> UpdateAsync(int id, ChucVuDto dto)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                "UPDATE ChucVu SET TenChucVu = @TenChucVu, MoTa = @MoTa WHERE MaChucVu = @Id", conn);
            
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.Parameters.AddWithValue("@TenChucVu", dto.TenChucVu);
            cmd.Parameters.AddWithValue("@MoTa", (object?)dto.MoTa ?? DBNull.Value);
            
            await conn.OpenAsync();
            var rows = await cmd.ExecuteNonQueryAsync();
            
            if (rows == 0) return null;
            dto.MaChucVu = id;
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("DELETE FROM ChucVu WHERE MaChucVu = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", id);
            
            await conn.OpenAsync();
            var rows = await cmd.ExecuteNonQueryAsync();
            return rows > 0;
        }
    }
}
