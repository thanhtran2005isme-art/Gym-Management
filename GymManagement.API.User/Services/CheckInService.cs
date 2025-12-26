using Microsoft.Data.SqlClient;
using GymManagement.Shared.DTOs;

namespace GymManagement.API.User.Services
{
    public class CheckInService : ICheckInService
    {
        private readonly string _connectionString;

        public CheckInService(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<CheckInDto> CheckInAsync(CheckInRequest request)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            // Kiểm tra thành viên có gói tập còn hiệu lực không
            using var cmdCheck = new SqlCommand(
                @"SELECT COUNT(*) FROM DangKyGoiTap 
                  WHERE MaThanhVien = @MaThanhVien AND TrangThai = 'HoatDong' AND NgayKetThuc >= @Now", conn);
            cmdCheck.Parameters.AddWithValue("@MaThanhVien", request.MaThanhVien);
            cmdCheck.Parameters.AddWithValue("@Now", DateTime.Now);

            var count = (int)await cmdCheck.ExecuteScalarAsync();
            if (count == 0)
                throw new Exception("Thành viên không có gói tập còn hiệu lực!");

            // Kiểm tra đã check-in chưa
            using var cmdExisting = new SqlCommand(
                "SELECT COUNT(*) FROM CheckIn WHERE MaThanhVien = @MaThanhVien AND ThoiGianRa IS NULL", conn);
            cmdExisting.Parameters.AddWithValue("@MaThanhVien", request.MaThanhVien);

            var existingCount = (int)await cmdExisting.ExecuteScalarAsync();
            if (existingCount > 0)
                throw new Exception("Thành viên đã check-in, vui lòng check-out trước!");

            // Insert check-in
            var thoiGianVao = DateTime.Now;
            using var cmdInsert = new SqlCommand(
                @"INSERT INTO CheckIn (MaThanhVien, ThoiGianVao) OUTPUT INSERTED.MaCheckIn VALUES (@MaThanhVien, @ThoiGianVao)", conn);
            cmdInsert.Parameters.AddWithValue("@MaThanhVien", request.MaThanhVien);
            cmdInsert.Parameters.AddWithValue("@ThoiGianVao", thoiGianVao);

            var maCheckIn = (int)await cmdInsert.ExecuteScalarAsync();

            // Lấy tên thành viên
            using var cmdName = new SqlCommand("SELECT HoTen FROM ThanhVien WHERE MaThanhVien = @Id", conn);
            cmdName.Parameters.AddWithValue("@Id", request.MaThanhVien);
            var tenThanhVien = (string?)await cmdName.ExecuteScalarAsync();

            return new CheckInDto
            {
                MaCheckIn = maCheckIn,
                MaThanhVien = request.MaThanhVien,
                TenThanhVien = tenThanhVien,
                ThoiGianVao = thoiGianVao,
                ThoiGianRa = null
            };
        }

        public async Task<CheckInDto?> CheckOutAsync(CheckOutRequest request)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            var thoiGianRa = DateTime.Now;
            using var cmdUpdate = new SqlCommand(
                "UPDATE CheckIn SET ThoiGianRa = @ThoiGianRa WHERE MaCheckIn = @Id", conn);
            cmdUpdate.Parameters.AddWithValue("@Id", request.MaCheckIn);
            cmdUpdate.Parameters.AddWithValue("@ThoiGianRa", thoiGianRa);

            var rows = await cmdUpdate.ExecuteNonQueryAsync();
            if (rows == 0) return null;

            // Lấy thông tin check-in
            using var cmdGet = new SqlCommand(
                @"SELECT ci.MaCheckIn, ci.MaThanhVien, tv.HoTen, ci.ThoiGianVao, ci.ThoiGianRa 
                  FROM CheckIn ci 
                  LEFT JOIN ThanhVien tv ON ci.MaThanhVien = tv.MaThanhVien 
                  WHERE ci.MaCheckIn = @Id", conn);
            cmdGet.Parameters.AddWithValue("@Id", request.MaCheckIn);

            using var reader = await cmdGet.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return MapToDto(reader);
            }
            return null;
        }

        public async Task<IEnumerable<CheckInDto>> GetHistoryByMemberAsync(int maThanhVien)
        {
            var list = new List<CheckInDto>();
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                @"SELECT ci.MaCheckIn, ci.MaThanhVien, tv.HoTen, ci.ThoiGianVao, ci.ThoiGianRa 
                  FROM CheckIn ci 
                  LEFT JOIN ThanhVien tv ON ci.MaThanhVien = tv.MaThanhVien 
                  WHERE ci.MaThanhVien = @MaThanhVien 
                  ORDER BY ci.ThoiGianVao DESC", conn);
            cmd.Parameters.AddWithValue("@MaThanhVien", maThanhVien);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(MapToDto(reader));
            }
            return list;
        }

        public async Task<CheckInDto?> GetCurrentCheckInAsync(int maThanhVien)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                @"SELECT ci.MaCheckIn, ci.MaThanhVien, tv.HoTen, ci.ThoiGianVao, ci.ThoiGianRa 
                  FROM CheckIn ci 
                  LEFT JOIN ThanhVien tv ON ci.MaThanhVien = tv.MaThanhVien 
                  WHERE ci.MaThanhVien = @MaThanhVien AND ci.ThoiGianRa IS NULL", conn);
            cmd.Parameters.AddWithValue("@MaThanhVien", maThanhVien);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return MapToDto(reader);
            }
            return null;
        }

        private static CheckInDto MapToDto(SqlDataReader reader)
        {
            return new CheckInDto
            {
                MaCheckIn = reader.GetInt32(0),
                MaThanhVien = reader.GetInt32(1),
                TenThanhVien = reader.IsDBNull(2) ? null : reader.GetString(2),
                ThoiGianVao = reader.GetDateTime(3),
                ThoiGianRa = reader.IsDBNull(4) ? null : reader.GetDateTime(4)
            };
        }
    }
}
