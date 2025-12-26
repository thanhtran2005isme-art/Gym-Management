using Microsoft.Data.SqlClient;
using GymManagement.Shared.DTOs;

namespace GymManagement.API.User.Services
{
    public class GoiTapService : IGoiTapService
    {
        private readonly string _connectionString;

        public GoiTapService(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<GoiTapDto>> GetAllActiveAsync()
        {
            var list = new List<GoiTapDto>();
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                "SELECT MaGoiTap, TenGoiTap, SoThang, SoLanTapToiDa, Gia, MoTa, TrangThai FROM GoiTap WHERE TrangThai = 1", conn);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new GoiTapDto
                {
                    MaGoiTap = reader.GetInt32(0),
                    TenGoiTap = reader.GetString(1),
                    SoThang = reader.GetInt32(2),
                    SoLanTapToiDa = reader.IsDBNull(3) ? null : reader.GetInt32(3),
                    Gia = reader.GetDecimal(4),
                    MoTa = reader.IsDBNull(5) ? null : reader.GetString(5),
                    TrangThai = reader.GetByte(6)
                });
            }
            return list;
        }

        public async Task<GoiTapDto?> GetByIdAsync(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                "SELECT MaGoiTap, TenGoiTap, SoThang, SoLanTapToiDa, Gia, MoTa, TrangThai FROM GoiTap WHERE MaGoiTap = @Id AND TrangThai = 1", conn);
            cmd.Parameters.AddWithValue("@Id", id);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
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
            return null;
        }
    }
}
