using GymManagement.API.User.DTOs;
using GymManagement.DbHelper;

namespace GymManagement.API.User.Services;

public class PackageService
{
    private readonly IDbHelper _db;
    public PackageService(IDbHelper db) => _db = db;

    public async Task<List<MyPackageDto>> GetMyPackages(int maThanhVien)
    {
        var sql = @"SELECT hd.MaHopDongGoiTap, gt.TenGoiTap, hd.NgayBatDau, hd.NgayKetThuc,
                    hd.TongTien, hd.SoTienGiam, hd.SoTienPhaiTra, hd.TrangThai,
                    DATEDIFF(DAY, GETDATE(), hd.NgayKetThuc) AS SoNgayConLai
                    FROM HopDongGoiTap hd JOIN GoiTap gt ON hd.MaGoiTap = gt.MaGoiTap
                    WHERE hd.MaThanhVien = @MaThanhVien ORDER BY hd.NgayTao DESC";
        var result = await _db.QueryAsync<dynamic>(sql, new { MaThanhVien = maThanhVien });
        return result.Select(MapToMyPackageDto).ToList();
    }

    public async Task<List<MyPackageDto>> GetActivePackages(int maThanhVien)
    {
        var sql = @"SELECT hd.MaHopDongGoiTap, gt.TenGoiTap, hd.NgayBatDau, hd.NgayKetThuc,
                    hd.TongTien, hd.SoTienGiam, hd.SoTienPhaiTra, hd.TrangThai,
                    DATEDIFF(DAY, GETDATE(), hd.NgayKetThuc) AS SoNgayConLai
                    FROM HopDongGoiTap hd JOIN GoiTap gt ON hd.MaGoiTap = gt.MaGoiTap
                    WHERE hd.MaThanhVien = @MaThanhVien AND hd.TrangThai = 1 
                    AND hd.NgayKetThuc >= GETDATE()";
        var result = await _db.QueryAsync<dynamic>(sql, new { MaThanhVien = maThanhVien });
        return result.Select(MapToMyPackageDto).ToList();
    }

    public async Task<MyPackageDetailDto?> GetPackageDetail(int maThanhVien, int id)
    {
        var sql = @"SELECT hd.*, gt.TenGoiTap, gt.SoLanTapToiDa, gt.MoTa AS MoTaGoiTap,
                    DATEDIFF(DAY, GETDATE(), hd.NgayKetThuc) AS SoNgayConLai,
                    (SELECT COUNT(*) FROM DiemDanhThanhVien WHERE MaThanhVien = @MaThanhVien 
                     AND ThoiGianVao BETWEEN hd.NgayBatDau AND hd.NgayKetThuc) AS SoLanDaTap
                    FROM HopDongGoiTap hd JOIN GoiTap gt ON hd.MaGoiTap = gt.MaGoiTap
                    WHERE hd.MaHopDongGoiTap = @Id AND hd.MaThanhVien = @MaThanhVien";
        return await _db.QueryFirstOrDefaultAsync<MyPackageDetailDto>(sql, new { MaThanhVien = maThanhVien, Id = id });
    }

    public async Task<List<MyPackageDto>> GetPackageHistory(int maThanhVien)
    {
        var sql = @"SELECT hd.MaHopDongGoiTap, gt.TenGoiTap, hd.NgayBatDau, hd.NgayKetThuc,
                    hd.TongTien, hd.SoTienGiam, hd.SoTienPhaiTra, hd.TrangThai,
                    DATEDIFF(DAY, GETDATE(), hd.NgayKetThuc) AS SoNgayConLai
                    FROM HopDongGoiTap hd JOIN GoiTap gt ON hd.MaGoiTap = gt.MaGoiTap
                    WHERE hd.MaThanhVien = @MaThanhVien AND (hd.TrangThai != 1 OR hd.NgayKetThuc < GETDATE())
                    ORDER BY hd.NgayKetThuc DESC";
        var result = await _db.QueryAsync<dynamic>(sql, new { MaThanhVien = maThanhVien });
        return result.Select(MapToMyPackageDto).ToList();
    }

    public async Task<List<GoiTapDto>> GetAllGoiTap()
    {
        var sql = @"SELECT MaGoiTap, TenGoiTap, SoThang, SoLanTapToiDa, Gia, MoTa 
                    FROM GoiTap WHERE TrangThai = 1";
        return (await _db.QueryAsync<GoiTapDto>(sql)).ToList();
    }

    public async Task<GoiTapDto?> GetGoiTapById(int id)
    {
        var sql = @"SELECT MaGoiTap, TenGoiTap, SoThang, SoLanTapToiDa, Gia, MoTa 
                    FROM GoiTap WHERE MaGoiTap = @Id AND TrangThai = 1";
        return await _db.QueryFirstOrDefaultAsync<GoiTapDto>(sql, new { Id = id });
    }

    public async Task<List<GoiPTDto>> GetAllGoiPT()
    {
        var sql = @"SELECT MaGoiPT, TenGoiPT, SoBuoi, Gia, MoTa FROM GoiPT WHERE TrangThai = 1";
        return (await _db.QueryAsync<GoiPTDto>(sql)).ToList();
    }

    public async Task<GoiPTDto?> GetGoiPTById(int id)
    {
        var sql = @"SELECT MaGoiPT, TenGoiPT, SoBuoi, Gia, MoTa FROM GoiPT WHERE MaGoiPT = @Id AND TrangThai = 1";
        return await _db.QueryFirstOrDefaultAsync<GoiPTDto>(sql, new { Id = id });
    }

    private static MyPackageDto MapToMyPackageDto(dynamic r) => new()
    {
        MaHopDongGoiTap = r.MaHopDongGoiTap, TenGoiTap = r.TenGoiTap, NgayBatDau = r.NgayBatDau,
        NgayKetThuc = r.NgayKetThuc, TongTien = r.TongTien, SoTienGiam = r.SoTienGiam,
        SoTienPhaiTra = r.SoTienPhaiTra, TrangThai = r.TrangThai, SoNgayConLai = r.SoNgayConLai,
        TrangThaiText = r.TrangThai == 1 ? "Hiệu lực" : r.TrangThai == 2 ? "Hết hạn" : "Hủy"
    };
}
