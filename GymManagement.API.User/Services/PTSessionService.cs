using GymManagement.API.User.DTOs;
using GymManagement.DbHelper;

namespace GymManagement.API.User.Services;

public class PTSessionService
{
    private readonly IDbHelper _db;
    public PTSessionService(IDbHelper db) => _db = db;

    public async Task<List<PTSessionDto>> GetMySessions(int maThanhVien)
    {
        var sql = @"SELECT bt.MaBuoiTapPT, bt.MaHopDongPT, gpt.TenGoiPT, nv.HoTen AS TenHuanLuyenVien,
                    bt.ThoiGianBatDau, bt.ThoiGianKetThuc, bt.TrangThai, bt.GhiChu
                    FROM BuoiTapPT bt
                    JOIN HopDongPT hd ON bt.MaHopDongPT = hd.MaHopDongPT
                    JOIN GoiPT gpt ON hd.MaGoiPT = gpt.MaGoiPT
                    JOIN HuanLuyenVien hlv ON hd.MaHuanLuyenVien = hlv.MaHuanLuyenVien
                    JOIN NhanVien nv ON hlv.MaNhanVien = nv.MaNhanVien
                    WHERE hd.MaThanhVien = @MaThanhVien ORDER BY bt.ThoiGianBatDau DESC";
        var result = await _db.QueryAsync<dynamic>(sql, new { MaThanhVien = maThanhVien });
        return result.Select(MapToDto).ToList();
    }

    public async Task<List<PTSessionDto>> GetUpcomingSessions(int maThanhVien)
    {
        var sql = @"SELECT bt.MaBuoiTapPT, bt.MaHopDongPT, gpt.TenGoiPT, nv.HoTen AS TenHuanLuyenVien,
                    bt.ThoiGianBatDau, bt.ThoiGianKetThuc, bt.TrangThai, bt.GhiChu
                    FROM BuoiTapPT bt
                    JOIN HopDongPT hd ON bt.MaHopDongPT = hd.MaHopDongPT
                    JOIN GoiPT gpt ON hd.MaGoiPT = gpt.MaGoiPT
                    JOIN HuanLuyenVien hlv ON hd.MaHuanLuyenVien = hlv.MaHuanLuyenVien
                    JOIN NhanVien nv ON hlv.MaNhanVien = nv.MaNhanVien
                    WHERE hd.MaThanhVien = @MaThanhVien AND bt.TrangThai = 1 
                    AND bt.ThoiGianBatDau >= GETDATE() ORDER BY bt.ThoiGianBatDau";
        var result = await _db.QueryAsync<dynamic>(sql, new { MaThanhVien = maThanhVien });
        return result.Select(MapToDto).ToList();
    }

    public async Task<List<PTSessionDto>> GetSessionHistory(int maThanhVien)
    {
        var sql = @"SELECT bt.MaBuoiTapPT, bt.MaHopDongPT, gpt.TenGoiPT, nv.HoTen AS TenHuanLuyenVien,
                    bt.ThoiGianBatDau, bt.ThoiGianKetThuc, bt.TrangThai, bt.GhiChu
                    FROM BuoiTapPT bt
                    JOIN HopDongPT hd ON bt.MaHopDongPT = hd.MaHopDongPT
                    JOIN GoiPT gpt ON hd.MaGoiPT = gpt.MaGoiPT
                    JOIN HuanLuyenVien hlv ON hd.MaHuanLuyenVien = hlv.MaHuanLuyenVien
                    JOIN NhanVien nv ON hlv.MaNhanVien = nv.MaNhanVien
                    WHERE hd.MaThanhVien = @MaThanhVien AND (bt.TrangThai = 2 OR bt.ThoiGianKetThuc < GETDATE())
                    ORDER BY bt.ThoiGianBatDau DESC";
        var result = await _db.QueryAsync<dynamic>(sql, new { MaThanhVien = maThanhVien });
        return result.Select(MapToDto).ToList();
    }

    public async Task<List<MyPTContractDto>> GetMyContracts(int maThanhVien)
    {
        var sql = @"SELECT hd.MaHopDongPT, gpt.TenGoiPT, nv.HoTen AS TenHuanLuyenVien, nv.SoDienThoai AS SoDienThoaiHLV,
                    hd.NgayBatDau, hd.NgayKetThuc, gpt.SoBuoi AS TongSoBuoi, hd.TongTien, hd.TrangThai,
                    (SELECT COUNT(*) FROM BuoiTapPT WHERE MaHopDongPT = hd.MaHopDongPT AND TrangThai = 2) AS SoBuoiDaTap
                    FROM HopDongPT hd
                    JOIN GoiPT gpt ON hd.MaGoiPT = gpt.MaGoiPT
                    JOIN HuanLuyenVien hlv ON hd.MaHuanLuyenVien = hlv.MaHuanLuyenVien
                    JOIN NhanVien nv ON hlv.MaNhanVien = nv.MaNhanVien
                    WHERE hd.MaThanhVien = @MaThanhVien ORDER BY hd.NgayTao DESC";
        var result = await _db.QueryAsync<dynamic>(sql, new { MaThanhVien = maThanhVien });
        return result.Select(r => new MyPTContractDto
        {
            MaHopDongPT = r.MaHopDongPT, TenGoiPT = r.TenGoiPT, TenHuanLuyenVien = r.TenHuanLuyenVien,
            SoDienThoaiHLV = r.SoDienThoaiHLV, NgayBatDau = r.NgayBatDau, NgayKetThuc = r.NgayKetThuc,
            TongSoBuoi = r.TongSoBuoi, SoBuoiDaTap = r.SoBuoiDaTap, SoBuoiConLai = r.TongSoBuoi - r.SoBuoiDaTap,
            TongTien = r.TongTien, TrangThai = r.TrangThai,
            TrangThaiText = r.TrangThai == 1 ? "Hiệu lực" : r.TrangThai == 2 ? "Hết hạn" : "Hủy"
        }).ToList();
    }

    private static PTSessionDto MapToDto(dynamic r) => new()
    {
        MaBuoiTapPT = r.MaBuoiTapPT, MaHopDongPT = r.MaHopDongPT, TenGoiPT = r.TenGoiPT,
        TenHuanLuyenVien = r.TenHuanLuyenVien, ThoiGianBatDau = r.ThoiGianBatDau,
        ThoiGianKetThuc = r.ThoiGianKetThuc, TrangThai = r.TrangThai, GhiChu = r.GhiChu,
        TrangThaiText = r.TrangThai == 1 ? "Đặt lịch" : r.TrangThai == 2 ? "Hoàn thành" : "Hủy"
    };
}
