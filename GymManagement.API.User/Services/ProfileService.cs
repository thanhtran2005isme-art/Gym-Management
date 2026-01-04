using GymManagement.API.User.DTOs;
using GymManagement.DbHelper;

namespace GymManagement.API.User.Services;

public class ProfileService
{
    private readonly IDbHelper _db;
    public ProfileService(IDbHelper db) => _db = db;

    public async Task<ProfileDto?> GetProfile(int maThanhVien)
    {
        var sql = @"SELECT MaThanhVien, MaThe, HoTen, NgaySinh, GioiTinh, 
                    SoDienThoai, Email, DiaChi, NgayDangKy, TrangThai 
                    FROM ThanhVien WHERE MaThanhVien = @MaThanhVien";
        return await _db.QueryFirstOrDefaultAsync<ProfileDto>(sql, new { MaThanhVien = maThanhVien });
    }

    public async Task<bool> UpdateProfile(int maThanhVien, UpdateProfileDto dto)
    {
        var sql = @"UPDATE ThanhVien SET 
                    HoTen = ISNULL(@HoTen, HoTen),
                    NgaySinh = ISNULL(@NgaySinh, NgaySinh),
                    GioiTinh = ISNULL(@GioiTinh, GioiTinh),
                    SoDienThoai = ISNULL(@SoDienThoai, SoDienThoai),
                    Email = ISNULL(@Email, Email),
                    DiaChi = ISNULL(@DiaChi, DiaChi)
                    WHERE MaThanhVien = @MaThanhVien";
        var rows = await _db.ExecuteAsync(sql, new { MaThanhVien = maThanhVien, dto.HoTen, dto.NgaySinh, dto.GioiTinh, dto.SoDienThoai, dto.Email, dto.DiaChi });
        return rows > 0;
    }

    public async Task<bool> ChangePassword(int maThanhVien, ChangePasswordDto dto)
    {
        if (dto.MatKhauMoi != dto.XacNhanMatKhau) return false;
        var checkSql = @"SELECT COUNT(*) FROM TaiKhoan WHERE MaThanhVien = @MaThanhVien AND MatKhauHash = @MatKhauCu";
        var count = await _db.ExecuteScalarAsync<int>(checkSql, new { MaThanhVien = maThanhVien, dto.MatKhauCu });
        if (count == 0) return false;
        var sql = @"UPDATE TaiKhoan SET MatKhauHash = @MatKhauMoi WHERE MaThanhVien = @MaThanhVien";
        return await _db.ExecuteAsync(sql, new { MaThanhVien = maThanhVien, dto.MatKhauMoi }) > 0;
    }
}
