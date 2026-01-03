using GymManagement.API.User.DTOs;
using GymManagement.DbHelper;

namespace GymManagement.API.User.Services;

public class ThongTinCaNhanService
{
    private readonly IDbHelper _db;
    public ThongTinCaNhanService(IDbHelper db) => _db = db;

    public async Task<ThongTinCaNhanDto?> GetThongTin(int maThanhVien)
    {
        var sql = @"SELECT * FROM ThanhVien WHERE MaThanhVien = @MaThanhVien";
        var result = await _db.QueryFirstOrDefaultAsync<dynamic>(sql, new { MaThanhVien = maThanhVien });
        if (result == null) return null;
        return new ThongTinCaNhanDto
        {
            MaThanhVien = result.MaThanhVien,
            MaThe = result.MaThe,
            HoTen = result.HoTen,
            NgaySinh = result.NgaySinh,
            GioiTinh = result.GioiTinh,
            SoDienThoai = result.SoDienThoai,
            Email = result.Email,
            DiaChi = result.DiaChi,
            NgayDangKy = result.NgayDangKy,
            TrangThai = result.TrangThai,
            GhiChu = result.GhiChu
        };
    }

    public async Task<bool> CapNhatThongTin(int maThanhVien, CapNhatThongTinRequestDto dto)
    {
        var sql = @"UPDATE ThanhVien SET HoTen = ISNULL(@HoTen, HoTen),
                    NgaySinh = ISNULL(@NgaySinh, NgaySinh), GioiTinh = ISNULL(@GioiTinh, GioiTinh),
                    SoDienThoai = ISNULL(@SoDienThoai, SoDienThoai), Email = ISNULL(@Email, Email),
                    DiaChi = ISNULL(@DiaChi, DiaChi) WHERE MaThanhVien = @MaThanhVien";
        var rows = await _db.ExecuteAsync(sql, new { MaThanhVien = maThanhVien, dto.HoTen, dto.NgaySinh, dto.GioiTinh, dto.SoDienThoai, dto.Email, dto.DiaChi });
        return rows > 0;
    }

    public async Task<bool> DoiMatKhau(int maThanhVien, DoiMatKhauRequestDto dto)
    {
        if (dto.MatKhauMoi != dto.XacNhanMatKhauMoi) return false;
        
        // Kiểm tra mật khẩu cũ
        var checkSql = @"SELECT COUNT(*) FROM TaiKhoan WHERE MaThanhVien = @MaThanhVien AND MatKhauHash = @MatKhauCu";
        var count = await _db.ExecuteScalarAsync<int>(checkSql, new { MaThanhVien = maThanhVien, dto.MatKhauCu });
        if (count == 0) return false;

        // Cập nhật mật khẩu mới
        var sql = @"UPDATE TaiKhoan SET MatKhauHash = @MatKhauMoi WHERE MaThanhVien = @MaThanhVien";
        var rows = await _db.ExecuteAsync(sql, new { MaThanhVien = maThanhVien, dto.MatKhauMoi });
        return rows > 0;
    }
}
