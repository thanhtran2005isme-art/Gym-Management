using GymManagement.API.User.DTOs;
using GymManagement.DbHelper;

namespace GymManagement.API.User.Services;

public class DatLichPTService
{
    private readonly IDbHelper _db;
    public DatLichPTService(IDbHelper db) => _db = db;

    public async Task<List<HopDongPTDto>> GetHopDongPTByThanhVien(int maThanhVien)
    {
        var sql = @"SELECT hd.MaHopDongPT, gpt.TenGoiPT, nv.HoTen AS TenHuanLuyenVien,
                           hd.NgayBatDau, hd.NgayKetThuc, gpt.SoBuoi, hd.TrangThai,
                           (SELECT COUNT(*) FROM BuoiTapPT WHERE MaHopDongPT = hd.MaHopDongPT AND TrangThai = 2) AS SoBuoiDaTap
                    FROM HopDongPT hd
                    JOIN GoiPT gpt ON hd.MaGoiPT = gpt.MaGoiPT
                    JOIN HuanLuyenVien hlv ON hd.MaHuanLuyenVien = hlv.MaHuanLuyenVien
                    JOIN NhanVien nv ON hlv.MaNhanVien = nv.MaNhanVien
                    WHERE hd.MaThanhVien = @MaThanhVien AND hd.TrangThai = 1";
        var result = await _db.QueryAsync<dynamic>(sql, new { MaThanhVien = maThanhVien });
        return result.Select(r => new HopDongPTDto
        {
            MaHopDongPT = r.MaHopDongPT,
            TenGoiPT = r.TenGoiPT,
            TenHuanLuyenVien = r.TenHuanLuyenVien,
            NgayBatDau = r.NgayBatDau,
            NgayKetThuc = r.NgayKetThuc,
            SoBuoiConLai = r.SoBuoi - r.SoBuoiDaTap,
            TrangThai = r.TrangThai
        }).ToList();
    }

    public async Task<List<BuoiTapPTDto>> GetLichDatByHopDong(int maHopDongPT)
    {
        var sql = @"SELECT * FROM BuoiTapPT WHERE MaHopDongPT = @MaHopDongPT ORDER BY ThoiGianBatDau";
        var result = await _db.QueryAsync<dynamic>(sql, new { MaHopDongPT = maHopDongPT });
        return result.Select(r => new BuoiTapPTDto
        {
            MaBuoiTapPT = r.MaBuoiTapPT,
            MaHopDongPT = r.MaHopDongPT,
            ThoiGianBatDau = r.ThoiGianBatDau,
            ThoiGianKetThuc = r.ThoiGianKetThuc,
            TrangThai = r.TrangThai,
            TrangThaiText = r.TrangThai == 1 ? "Đặt lịch" : r.TrangThai == 2 ? "Hoàn thành" : "Hủy",
            GhiChu = r.GhiChu
        }).ToList();
    }

    public async Task<int> DatLich(DatLichPTRequestDto dto)
    {
        var sql = @"INSERT INTO BuoiTapPT (MaHopDongPT, ThoiGianBatDau, ThoiGianKetThuc, TrangThai, GhiChu)
                    VALUES (@MaHopDongPT, @ThoiGianBatDau, @ThoiGianKetThuc, 1, @GhiChu);
                    SELECT SCOPE_IDENTITY();";
        return await _db.ExecuteScalarAsync<int>(sql, dto);
    }

    public async Task<bool> CapNhatLich(int maBuoiTapPT, CapNhatLichPTDto dto)
    {
        var sql = @"UPDATE BuoiTapPT SET ThoiGianBatDau = @ThoiGianBatDau, 
                    ThoiGianKetThuc = @ThoiGianKetThuc, GhiChu = @GhiChu
                    WHERE MaBuoiTapPT = @MaBuoiTapPT AND TrangThai = 1";
        var rows = await _db.ExecuteAsync(sql, new { MaBuoiTapPT = maBuoiTapPT, dto.ThoiGianBatDau, dto.ThoiGianKetThuc, dto.GhiChu });
        return rows > 0;
    }

    public async Task<bool> HuyLich(int maBuoiTapPT)
    {
        var sql = @"UPDATE BuoiTapPT SET TrangThai = 3 WHERE MaBuoiTapPT = @MaBuoiTapPT AND TrangThai = 1";
        var rows = await _db.ExecuteAsync(sql, new { MaBuoiTapPT = maBuoiTapPT });
        return rows > 0;
    }
}
