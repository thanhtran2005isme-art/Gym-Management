using GymManagement.API.User.DTOs;
using GymManagement.DbHelper;

namespace GymManagement.API.User.Services;

public class InvoiceService
{
    private readonly IDbHelper _db;
    public InvoiceService(IDbHelper db) => _db = db;

    public async Task<List<InvoiceDto>> GetMyInvoices(int maThanhVien)
    {
        var sql = @"SELECT MaHoaDon, NgayLap, TongTien, GiamGia, SoTienThanhToan, HinhThucThanhToan, TrangThai
                    FROM HoaDon WHERE MaThanhVien = @MaThanhVien ORDER BY NgayLap DESC";
        var result = await _db.QueryAsync<dynamic>(sql, new { MaThanhVien = maThanhVien });
        return result.Select(r => new InvoiceDto
        {
            MaHoaDon = r.MaHoaDon, NgayLap = r.NgayLap, TongTien = r.TongTien, GiamGia = r.GiamGia,
            SoTienThanhToan = r.SoTienThanhToan, HinhThucThanhToan = r.HinhThucThanhToan, TrangThai = r.TrangThai,
            TrangThaiText = r.TrangThai == 1 ? "Đã thanh toán" : "Hủy"
        }).ToList();
    }

    public async Task<InvoiceDetailDto?> GetInvoiceDetail(int maThanhVien, int id)
    {
        var sql = @"SELECT hd.*, nv.HoTen AS TenNhanVienLap FROM HoaDon hd
                    LEFT JOIN NhanVien nv ON hd.MaNhanVienLap = nv.MaNhanVien
                    WHERE hd.MaHoaDon = @Id AND hd.MaThanhVien = @MaThanhVien";
        var invoice = await _db.QueryFirstOrDefaultAsync<dynamic>(sql, new { MaThanhVien = maThanhVien, Id = id });
        if (invoice == null) return null;

        var itemsSql = @"SELECT * FROM ChiTietHoaDon WHERE MaHoaDon = @Id";
        var items = await _db.QueryAsync<dynamic>(itemsSql, new { Id = id });

        return new InvoiceDetailDto
        {
            MaHoaDon = invoice.MaHoaDon, NgayLap = invoice.NgayLap, TongTien = invoice.TongTien,
            GiamGia = invoice.GiamGia, SoTienThanhToan = invoice.SoTienThanhToan,
            HinhThucThanhToan = invoice.HinhThucThanhToan, TrangThai = invoice.TrangThai,
            TrangThaiText = invoice.TrangThai == 1 ? "Đã thanh toán" : "Hủy",
            TenNhanVienLap = invoice.TenNhanVienLap, GhiChu = invoice.GhiChu,
            ChiTiet = items.Select(i => new InvoiceItemDto
            {
                MaChiTiet = i.MaChiTiet, LoaiSanPham = i.LoaiSanPham, TenSanPham = i.LoaiSanPham,
                SoLuong = i.SoLuong, DonGia = i.DonGia, ThanhTien = i.ThanhTien
            }).ToList()
        };
    }

    public async Task<List<PaymentHistoryDto>> GetPaymentHistory(int maThanhVien, int maHoaDon)
    {
        var sql = @"SELECT MaHoaDon, NgayLap AS NgayThanhToan, SoTienThanhToan AS SoTien, HinhThucThanhToan AS HinhThuc
                    FROM HoaDon WHERE MaHoaDon = @MaHoaDon AND MaThanhVien = @MaThanhVien AND TrangThai = 1";
        return (await _db.QueryAsync<PaymentHistoryDto>(sql, new { MaThanhVien = maThanhVien, MaHoaDon = maHoaDon })).ToList();
    }
}
