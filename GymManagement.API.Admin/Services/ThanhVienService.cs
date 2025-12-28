using System.Data;
using GymManagement.DbHelper;
using GymManagement.API.Admin.DTOs;

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
            var dt = await _db.ExecuteQueryAsync(
                "SELECT MaThanhVien, MaThe, HoTen, NgaySinh, GioiTinh, SoDienThoai, Email, DiaChi, NgayDangKy, TrangThai FROM ThanhVien");
            
            return dt.AsEnumerable().Select(row => new ThanhVienDto
            {
                MaThanhVien = row.Field<int>("MaThanhVien"),
                MaThe = row.Field<string?>("MaThe"),
                HoTen = row.Field<string>("HoTen")!,
                NgaySinh = row.Field<DateTime?>("NgaySinh"),
                GioiTinh = row.Field<string?>("GioiTinh"),
                SoDienThoai = row.Field<string?>("SoDienThoai"),
                Email = row.Field<string?>("Email"),
                DiaChi = row.Field<string?>("DiaChi"),
                NgayDangKy = row.Field<DateTime>("NgayDangKy"),
                TrangThai = row.Field<byte>("TrangThai")
            });
        }

        public async Task<ThanhVienDto?> GetByIdAsync(int id)
        {
            var dt = await _db.ExecuteQueryAsync(
                "SELECT MaThanhVien, MaThe, HoTen, NgaySinh, GioiTinh, SoDienThoai, Email, DiaChi, NgayDangKy, TrangThai FROM ThanhVien WHERE MaThanhVien = @Id",
                new Dictionary<string, object> { { "@Id", id } });
            
            var row = dt.AsEnumerable().FirstOrDefault();
            if (row == null) return null;

            return new ThanhVienDto
            {
                MaThanhVien = row.Field<int>("MaThanhVien"),
                MaThe = row.Field<string?>("MaThe"),
                HoTen = row.Field<string>("HoTen")!,
                NgaySinh = row.Field<DateTime?>("NgaySinh"),
                GioiTinh = row.Field<string?>("GioiTinh"),
                SoDienThoai = row.Field<string?>("SoDienThoai"),
                Email = row.Field<string?>("Email"),
                DiaChi = row.Field<string?>("DiaChi"),
                NgayDangKy = row.Field<DateTime>("NgayDangKy"),
                TrangThai = row.Field<byte>("TrangThai")
            };
        }

        public async Task<ThanhVienDto> CreateAsync(ThanhVienDto dto)
        {
            var id = await _db.ExecuteScalarAsync(
                @"INSERT INTO ThanhVien (MaThe, HoTen, NgaySinh, GioiTinh, SoDienThoai, Email, DiaChi, NgayDangKy, TrangThai) 
                  OUTPUT INSERTED.MaThanhVien 
                  VALUES (@MaThe, @HoTen, @NgaySinh, @GioiTinh, @SoDienThoai, @Email, @DiaChi, @NgayDangKy, @TrangThai)",
                new Dictionary<string, object>
                {
                    { "@MaThe", dto.MaThe! },
                    { "@HoTen", dto.HoTen },
                    { "@NgaySinh", dto.NgaySinh! },
                    { "@GioiTinh", dto.GioiTinh! },
                    { "@SoDienThoai", dto.SoDienThoai! },
                    { "@Email", dto.Email! },
                    { "@DiaChi", dto.DiaChi! },
                    { "@NgayDangKy", DateTime.Now },
                    { "@TrangThai", (byte)1 }
                });
            
            dto.MaThanhVien = (int)id!;
            dto.NgayDangKy = DateTime.Now;
            dto.TrangThai = 1;
            return dto;
        }

        public async Task<ThanhVienDto?> UpdateAsync(int id, ThanhVienDto dto)
        {
            var rows = await _db.ExecuteNonQueryAsync(
                @"UPDATE ThanhVien SET MaThe = @MaThe, HoTen = @HoTen, NgaySinh = @NgaySinh, GioiTinh = @GioiTinh, 
                  SoDienThoai = @SoDienThoai, Email = @Email, DiaChi = @DiaChi, TrangThai = @TrangThai 
                  WHERE MaThanhVien = @Id",
                new Dictionary<string, object>
                {
                    { "@Id", id },
                    { "@MaThe", dto.MaThe! },
                    { "@HoTen", dto.HoTen },
                    { "@NgaySinh", dto.NgaySinh! },
                    { "@GioiTinh", dto.GioiTinh! },
                    { "@SoDienThoai", dto.SoDienThoai! },
                    { "@Email", dto.Email! },
                    { "@DiaChi", dto.DiaChi! },
                    { "@TrangThai", dto.TrangThai }
                });
            
            if (rows == 0) return null;
            dto.MaThanhVien = id;
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var rows = await _db.ExecuteNonQueryAsync(
                "DELETE FROM ThanhVien WHERE MaThanhVien = @Id",
                new Dictionary<string, object> { { "@Id", id } });
            return rows > 0;
        }
    }
}
