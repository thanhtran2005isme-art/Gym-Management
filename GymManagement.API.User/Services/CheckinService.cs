using GymManagement.API.User.DTOs;
using GymManagement.DbHelper;

namespace GymManagement.API.User.Services;

public class CheckinService
{
    private readonly IDbHelper _db;
    public CheckinService(IDbHelper db) => _db = db;

    public async Task<List<SessionDto>> GetMySessions(int maThanhVien)
    {
        var sql = @"SELECT MaDiemDanh, CAST(ThoiGianVao AS DATE) AS NgayTap, ThoiGianVao, ThoiGianRa,
                    DATEDIFF(MINUTE, ThoiGianVao, ThoiGianRa) AS ThoiGianTapPhut
                    FROM DiemDanhThanhVien WHERE MaThanhVien = @MaThanhVien ORDER BY ThoiGianVao DESC";
        return (await _db.QueryAsync<SessionDto>(sql, new { MaThanhVien = maThanhVien })).ToList();
    }

    public async Task<SessionStatsDto> GetSessionStats(int maThanhVien)
    {
        var sql = @"SELECT COUNT(*) AS TongSoBuoiTap,
                    ISNULL(SUM(DATEDIFF(MINUTE, ThoiGianVao, ThoiGianRa)), 0) AS TongThoiGianPhut,
                    ISNULL(AVG(CAST(DATEDIFF(MINUTE, ThoiGianVao, ThoiGianRa) AS FLOAT)), 0) AS TrungBinhThoiGianPhut,
                    (SELECT COUNT(*) FROM DiemDanhThanhVien WHERE MaThanhVien = @MaThanhVien 
                     AND MONTH(ThoiGianVao) = MONTH(GETDATE()) AND YEAR(ThoiGianVao) = YEAR(GETDATE())) AS SoBuoiThangNay,
                    (SELECT COUNT(*) FROM DiemDanhThanhVien WHERE MaThanhVien = @MaThanhVien 
                     AND ThoiGianVao >= DATEADD(DAY, -7, GETDATE())) AS SoBuoiTuanNay
                    FROM DiemDanhThanhVien WHERE MaThanhVien = @MaThanhVien";
        return await _db.QueryFirstOrDefaultAsync<SessionStatsDto>(sql, new { MaThanhVien = maThanhVien }) ?? new();
    }

    public async Task<List<CheckinDto>> GetMyCheckins(int maThanhVien)
    {
        var sql = @"SELECT MaDiemDanh, ThoiGianVao, ThoiGianRa, HinhThuc, GhiChu,
                    DATEDIFF(MINUTE, ThoiGianVao, ThoiGianRa) AS ThoiGianTapPhut
                    FROM DiemDanhThanhVien WHERE MaThanhVien = @MaThanhVien ORDER BY ThoiGianVao DESC";
        return (await _db.QueryAsync<CheckinDto>(sql, new { MaThanhVien = maThanhVien })).ToList();
    }

    public async Task<CheckinDto?> GetTodayCheckin(int maThanhVien)
    {
        var sql = @"SELECT MaDiemDanh, ThoiGianVao, ThoiGianRa, HinhThuc, GhiChu,
                    DATEDIFF(MINUTE, ThoiGianVao, ThoiGianRa) AS ThoiGianTapPhut
                    FROM DiemDanhThanhVien WHERE MaThanhVien = @MaThanhVien 
                    AND CAST(ThoiGianVao AS DATE) = CAST(GETDATE() AS DATE)
                    ORDER BY ThoiGianVao DESC";
        return await _db.QueryFirstOrDefaultAsync<CheckinDto>(sql, new { MaThanhVien = maThanhVien });
    }

    public async Task<CheckinStatsDto> GetCheckinStats(int maThanhVien, int month, int year)
    {
        var sql = @"SELECT @Month AS Thang, @Year AS Nam,
                    COUNT(*) AS TongSoLanCheckin,
                    ISNULL(SUM(DATEDIFF(MINUTE, ThoiGianVao, ThoiGianRa)), 0) AS TongThoiGianTapPhut,
                    ISNULL(AVG(CAST(DATEDIFF(MINUTE, ThoiGianVao, ThoiGianRa) AS FLOAT)), 0) AS TrungBinhThoiGianPhut
                    FROM DiemDanhThanhVien WHERE MaThanhVien = @MaThanhVien 
                    AND MONTH(ThoiGianVao) = @Month AND YEAR(ThoiGianVao) = @Year";
        return await _db.QueryFirstOrDefaultAsync<CheckinStatsDto>(sql, new { MaThanhVien = maThanhVien, Month = month, Year = year }) ?? new();
    }
}
