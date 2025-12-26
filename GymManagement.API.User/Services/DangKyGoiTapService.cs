using Microsoft.Data.SqlClient;
using GymManagement.Shared.DTOs;

namespace GymManagement.API.User.Services
{
    public class DangKyGoiTapService : IDangKyGoiTapService
    {
        private readonly string _connectionString;

        public DangKyGoiTapService(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<DangKyGoiTapDto> DangKyAsync(DangKyGoiTapRequest request)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();

            // Kiểm tra gói tập
            using var cmdGoiTap = new SqlCommand("SELECT TenGoiTap, SoThang FROM GoiTap WHERE MaGoiTap = @Id", conn);
            cmdGoiTap.Parameters.AddWithValue("@Id", request.MaGoiTap);
            string? tenGoiTap = null;
            int soThang = 0;

            using (var reader = await cmdGoiTap.ExecuteReaderAsync())
            {
                if (!await reader.ReadAsync())
                    throw new Exception("Gói tập không tồn tại!");
                tenGoiTap = reader.GetString(0);
                soThang = reader.GetInt32(1);
            }

            // Kiểm tra thành viên
            using var cmdThanhVien = new SqlCommand("SELECT HoTen FROM ThanhVien WHERE MaThanhVien = @Id", conn);
            cmdThanhVien.Parameters.AddWithValue("@Id", request.MaThanhVien);
            string? tenThanhVien = null;

            using (var reader = await cmdThanhVien.ExecuteReaderAsync())
            {
                if (!await reader.ReadAsync())
                    throw new Exception("Thành viên không tồn tại!");
                tenThanhVien = reader.GetString(0);
            }

            var ngayBatDau = DateTime.Now;
            var ngayKetThuc = ngayBatDau.AddMonths(soThang);

            // Insert đăng ký
            using var cmdInsert = new SqlCommand(
                @"INSERT INTO DangKyGoiTap (MaThanhVien, MaGoiTap, NgayBatDau, NgayKetThuc, TrangThai) 
                  OUTPUT INSERTED.MaDangKy 
                  VALUES (@MaThanhVien, @MaGoiTap, @NgayBatDau, @NgayKetThuc, @TrangThai)", conn);

            cmdInsert.Parameters.AddWithValue("@MaThanhVien", request.MaThanhVien);
            cmdInsert.Parameters.AddWithValue("@MaGoiTap", request.MaGoiTap);
            cmdInsert.Parameters.AddWithValue("@NgayBatDau", ngayBatDau);
            cmdInsert.Parameters.AddWithValue("@NgayKetThuc", ngayKetThuc);
            cmdInsert.Parameters.AddWithValue("@TrangThai", "HoatDong");

            var maDangKy = (int)await cmdInsert.ExecuteScalarAsync();

            return new DangKyGoiTapDto
            {
                MaDangKy = maDangKy,
                MaThanhVien = request.MaThanhVien,
                TenThanhVien = tenThanhVien,
                MaGoiTap = request.MaGoiTap,
                TenGoiTap = tenGoiTap,
                NgayBatDau = ngayBatDau,
                NgayKetThuc = ngayKetThuc,
                TrangThai = "HoatDong"
            };
        }

        public async Task<IEnumerable<DangKyGoiTapDto>> GetByMemberAsync(int maThanhVien)
        {
            var list = new List<DangKyGoiTapDto>();
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                @"SELECT dk.MaDangKy, dk.MaThanhVien, tv.HoTen, dk.MaGoiTap, gt.TenGoiTap, dk.NgayBatDau, dk.NgayKetThuc, dk.TrangThai 
                  FROM DangKyGoiTap dk 
                  LEFT JOIN ThanhVien tv ON dk.MaThanhVien = tv.MaThanhVien 
                  LEFT JOIN GoiTap gt ON dk.MaGoiTap = gt.MaGoiTap 
                  WHERE dk.MaThanhVien = @MaThanhVien", conn);
            cmd.Parameters.AddWithValue("@MaThanhVien", maThanhVien);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(MapToDto(reader));
            }
            return list;
        }

        public async Task<DangKyGoiTapDto?> GetActivePackageAsync(int maThanhVien)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(
                @"SELECT TOP 1 dk.MaDangKy, dk.MaThanhVien, tv.HoTen, dk.MaGoiTap, gt.TenGoiTap, dk.NgayBatDau, dk.NgayKetThuc, dk.TrangThai 
                  FROM DangKyGoiTap dk 
                  LEFT JOIN ThanhVien tv ON dk.MaThanhVien = tv.MaThanhVien 
                  LEFT JOIN GoiTap gt ON dk.MaGoiTap = gt.MaGoiTap 
                  WHERE dk.MaThanhVien = @MaThanhVien AND dk.TrangThai = 'HoatDong' AND dk.NgayKetThuc >= @Now", conn);
            cmd.Parameters.AddWithValue("@MaThanhVien", maThanhVien);
            cmd.Parameters.AddWithValue("@Now", DateTime.Now);

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return MapToDto(reader);
            }
            return null;
        }

        public async Task<bool> HuyDangKyAsync(int maDangKy)
        {
            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("UPDATE DangKyGoiTap SET TrangThai = 'HuyBo' WHERE MaDangKy = @Id", conn);
            cmd.Parameters.AddWithValue("@Id", maDangKy);

            await conn.OpenAsync();
            var rows = await cmd.ExecuteNonQueryAsync();
            return rows > 0;
        }

        private static DangKyGoiTapDto MapToDto(SqlDataReader reader)
        {
            return new DangKyGoiTapDto
            {
                MaDangKy = reader.GetInt32(0),
                MaThanhVien = reader.GetInt32(1),
                TenThanhVien = reader.IsDBNull(2) ? null : reader.GetString(2),
                MaGoiTap = reader.GetInt32(3),
                TenGoiTap = reader.IsDBNull(4) ? null : reader.GetString(4),
                NgayBatDau = reader.GetDateTime(5),
                NgayKetThuc = reader.GetDateTime(6),
                TrangThai = reader.GetString(7)
            };
        }
    }
}
