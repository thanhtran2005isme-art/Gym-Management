using GymManagement.API.User.DTOs;
using GymManagement.DbHelper;

namespace GymManagement.API.User.Services;

public class LopHocNhomService
{
    private readonly IDbHelper _db;
    public LopHocNhomService(IDbHelper db) => _db = db;

    public async Task<List<LopHocNhomDto>> GetDanhSachLopHoc()
    {
        var sql = @"SELECT * FROM LopHocNhom WHERE TrangThai = 1";
        var result = await _db.QueryAsync<dynamic>(sql);
        return result.Select(r => new LopHocNhomDto
        {
            MaLopHoc = r.MaLopHoc,
            TenLopHoc = r.TenLopHoc,
            LoaiLop = r.LoaiLop,
            DoKho = r.DoKho,
            MoTa = r.MoTa
        }).ToList();
    }

    public async Task<List<LichLopNhomDto>> GetLichLopNhom(int? maLopHoc = null)
    {
        var sql = @"SELECT lln.*, lh.TenLopHoc, pt.TenPhong, nv.HoTen AS TenHuanLuyenVien,
                           (SELECT COUNT(*) FROM DangKyLopNhom WHERE MaLichLopNhom = lln.MaLichLopNhom AND TrangThai = 1) AS SoLuongDaDangKy
                    FROM LichLopNhom lln
                    JOIN LopHocNhom lh ON lln.MaLopHoc = lh.MaLopHoc
                    JOIN PhongTap pt ON lln.MaPhong = pt.MaPhong
                    JOIN HuanLuyenVien hlv ON lln.MaHuanLuyenVien = hlv.MaHuanLuyenVien
                    JOIN NhanVien nv ON hlv.MaNhanVien = nv.MaNhanVien
                    WHERE lln.TrangThai = 1 AND (@MaLopHoc IS NULL OR lln.MaLopHoc = @MaLopHoc)";
        var result = await _db.QueryAsync<dynamic>(sql, new { MaLopHoc = maLopHoc });
        string[] thuText = { "", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật" };
        return result.Select(r => new LichLopNhomDto
        {
            MaLichLopNhom = r.MaLichLopNhom,
            TenLopHoc = r.TenLopHoc,
            TenPhong = r.TenPhong,
            TenHuanLuyenVien = r.TenHuanLuyenVien,
            ThuTrongTuan = r.ThuTrongTuan,
            ThuText = thuText[r.ThuTrongTuan],
            GioBatDau = r.GioBatDau,
            GioKetThuc = r.GioKetThuc,
            SoLuongToiDa = r.SoLuongToiDa,
            SoLuongDaDangKy = r.SoLuongDaDangKy,
            NgayBatDau = r.NgayBatDau,
            NgayKetThuc = r.NgayKetThuc
        }).ToList();
    }

    public async Task<int> DangKyLop(int maThanhVien, DangKyLopNhomRequestDto dto)
    {
        var sql = @"INSERT INTO DangKyLopNhom (MaThanhVien, MaLichLopNhom, TrangThai, GhiChu)
                    VALUES (@MaThanhVien, @MaLichLopNhom, 1, @GhiChu);
                    SELECT SCOPE_IDENTITY();";
        return await _db.ExecuteScalarAsync<int>(sql, new { MaThanhVien = maThanhVien, dto.MaLichLopNhom, dto.GhiChu });
    }

    public async Task<List<DangKyLopNhomDto>> GetDangKyByThanhVien(int maThanhVien)
    {
        var sql = @"SELECT dk.*, lh.TenLopHoc FROM DangKyLopNhom dk
                    JOIN LichLopNhom lln ON dk.MaLichLopNhom = lln.MaLichLopNhom
                    JOIN LopHocNhom lh ON lln.MaLopHoc = lh.MaLopHoc
                    WHERE dk.MaThanhVien = @MaThanhVien";
        var result = await _db.QueryAsync<dynamic>(sql, new { MaThanhVien = maThanhVien });
        return result.Select(r => new DangKyLopNhomDto
        {
            MaDangKy = r.MaDangKy,
            MaLichLopNhom = r.MaLichLopNhom,
            TenLopHoc = r.TenLopHoc,
            NgayDangKy = r.NgayDangKy,
            TrangThai = r.TrangThai,
            TrangThaiText = r.TrangThai == 1 ? "Đăng ký" : "Hủy",
            GhiChu = r.GhiChu
        }).ToList();
    }

    public async Task<bool> HuyDangKy(int maDangKy, int maThanhVien)
    {
        var sql = @"UPDATE DangKyLopNhom SET TrangThai = 2 WHERE MaDangKy = @MaDangKy AND MaThanhVien = @MaThanhVien";
        var rows = await _db.ExecuteAsync(sql, new { MaDangKy = maDangKy, MaThanhVien = maThanhVien });
        return rows > 0;
    }
}
