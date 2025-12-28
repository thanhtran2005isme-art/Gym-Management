using System.Data;
using GymManagement.DbHelper;
using GymManagement.API.Admin.DTOs;

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
            var dt = await _db.ExecuteQueryAsync(
                @"SELECT nv.MaNhanVien, nv.HoTen, nv.NgaySinh, nv.GioiTinh, nv.SoDienThoai, nv.Email, 
                  nv.DiaChi, nv.NgayVaoLam, nv.MaChucVu, cv.TenChucVu, nv.TrangThai 
                  FROM NhanVien nv LEFT JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu");
            
            return dt.AsEnumerable().Select(row => new NhanVienDto
            {
                MaNhanVien = row.Field<int>("MaNhanVien"),
                HoTen = row.Field<string>("HoTen")!,
                NgaySinh = row.Field<DateTime?>("NgaySinh"),
                GioiTinh = row.Field<string?>("GioiTinh"),
                SoDienThoai = row.Field<string?>("SoDienThoai"),
                Email = row.Field<string?>("Email"),
                DiaChi = row.Field<string?>("DiaChi"),
                NgayVaoLam = row.Field<DateTime?>("NgayVaoLam"),
                MaChucVu = row.Field<int?>("MaChucVu"),
                TenChucVu = row.Field<string?>("TenChucVu"),
                TrangThai = row.Field<byte>("TrangThai")
            });
        }

        public async Task<NhanVienDto?> GetByIdAsync(int id)
        {
            var dt = await _db.ExecuteQueryAsync(
                @"SELECT nv.MaNhanVien, nv.HoTen, nv.NgaySinh, nv.GioiTinh, nv.SoDienThoai, nv.Email, 
                  nv.DiaChi, nv.NgayVaoLam, nv.MaChucVu, cv.TenChucVu, nv.TrangThai 
                  FROM NhanVien nv LEFT JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu 
                  WHERE nv.MaNhanVien = @Id",
                new Dictionary<string, object> { { "@Id", id } });
            
            var row = dt.AsEnumerable().FirstOrDefault();
            if (row == null) return null;

            return new NhanVienDto
            {
                MaNhanVien = row.Field<int>("MaNhanVien"),
                HoTen = row.Field<string>("HoTen")!,
                NgaySinh = row.Field<DateTime?>("NgaySinh"),
                GioiTinh = row.Field<string?>("GioiTinh"),
                SoDienThoai = row.Field<string?>("SoDienThoai"),
                Email = row.Field<string?>("Email"),
                DiaChi = row.Field<string?>("DiaChi"),
                NgayVaoLam = row.Field<DateTime?>("NgayVaoLam"),
                MaChucVu = row.Field<int?>("MaChucVu"),
                TenChucVu = row.Field<string?>("TenChucVu"),
                TrangThai = row.Field<byte>("TrangThai")
            };
        }

        public async Task<NhanVienDto> CreateAsync(NhanVienDto dto)
        {
            var id = await _db.ExecuteScalarAsync(
                @"INSERT INTO NhanVien (HoTen, NgaySinh, GioiTinh, SoDienThoai, Email, DiaChi, NgayVaoLam, MaChucVu, TrangThai) 
                  OUTPUT INSERTED.MaNhanVien 
                  VALUES (@HoTen, @NgaySinh, @GioiTinh, @SoDienThoai, @Email, @DiaChi, @NgayVaoLam, @MaChucVu, @TrangThai)",
                new Dictionary<string, object>
                {
                    { "@HoTen", dto.HoTen },
                    { "@NgaySinh", dto.NgaySinh! },
                    { "@GioiTinh", dto.GioiTinh! },
                    { "@SoDienThoai", dto.SoDienThoai! },
                    { "@Email", dto.Email! },
                    { "@DiaChi", dto.DiaChi! },
                    { "@NgayVaoLam", dto.NgayVaoLam ?? DateTime.Now },
                    { "@MaChucVu", dto.MaChucVu! },
                    { "@TrangThai", dto.TrangThai }
                });
            dto.MaNhanVien = (int)id!;
            return dto;
        }

        public async Task<NhanVienDto?> UpdateAsync(int id, NhanVienDto dto)
        {
            var rows = await _db.ExecuteNonQueryAsync(
                @"UPDATE NhanVien SET HoTen = @HoTen, NgaySinh = @NgaySinh, GioiTinh = @GioiTinh, 
                  SoDienThoai = @SoDienThoai, Email = @Email, DiaChi = @DiaChi, NgayVaoLam = @NgayVaoLam, 
                  MaChucVu = @MaChucVu, TrangThai = @TrangThai WHERE MaNhanVien = @Id",
                new Dictionary<string, object>
                {
                    { "@Id", id },
                    { "@HoTen", dto.HoTen },
                    { "@NgaySinh", dto.NgaySinh! },
                    { "@GioiTinh", dto.GioiTinh! },
                    { "@SoDienThoai", dto.SoDienThoai! },
                    { "@Email", dto.Email! },
                    { "@DiaChi", dto.DiaChi! },
                    { "@NgayVaoLam", dto.NgayVaoLam! },
                    { "@MaChucVu", dto.MaChucVu! },
                    { "@TrangThai", dto.TrangThai }
                });
            if (rows == 0) return null;
            dto.MaNhanVien = id;
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var rows = await _db.ExecuteNonQueryAsync(
                "DELETE FROM NhanVien WHERE MaNhanVien = @Id",
                new Dictionary<string, object> { { "@Id", id } });
            return rows > 0;
        }
    }
}
