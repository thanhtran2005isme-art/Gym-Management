using GymManagement.API.Admin.DTOs;
using GymManagement.DbHelper;
using System.Data;

namespace GymManagement.API.Admin.Data
{
    public class HoaDonRepository : IHoaDonRepository
    {
        private readonly SqlServerHelper _dbHelper;

        public HoaDonRepository(SqlServerHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public async Task<IEnumerable<HoaDonDto>> GetAllAsync()
        {
            var query = @"
                SELECT h.*, 
                       tv.HoTen as TenThanhVien,
                       nv.HoTen as TenNhanVienLap
                FROM dbo.HoaDon h
                LEFT JOIN dbo.ThanhVien tv ON h.MaThanhVien = tv.MaThanhVien
                INNER JOIN dbo.NhanVien nv ON h.MaNhanVienLap = nv.MaNhanVien
                ORDER BY h.NgayLap DESC";

            var dt = await _dbHelper.ExecuteQueryAsync(query);
            var result = new List<HoaDonDto>();

            foreach (DataRow row in dt.Rows)
            {
                result.Add(MapToDto(row));
            }

            return result;
        }

        public async Task<HoaDonDto?> GetByIdAsync(int id)
        {
            var query = @"
                SELECT h.*, 
                       tv.HoTen as TenThanhVien,
                       nv.HoTen as TenNhanVienLap
                FROM dbo.HoaDon h
                LEFT JOIN dbo.ThanhVien tv ON h.MaThanhVien = tv.MaThanhVien
                INNER JOIN dbo.NhanVien nv ON h.MaNhanVienLap = nv.MaNhanVien
                WHERE h.MaHoaDon = @MaHoaDon";

            var parameters = new Dictionary<string, object>
            {
                { "@MaHoaDon", id }
            };

            var dt = await _dbHelper.ExecuteQueryAsync(query, parameters);
            if (dt.Rows.Count == 0) return null;

            var hoaDon = MapToDto(dt.Rows[0]);

            // Lấy chi tiết hóa đơn
            var chiTietQuery = @"
                SELECT ct.*,
                       CASE 
                           WHEN ct.LoaiSanPham = 'GoiTap' THEN gt.TenGoiTap
                           WHEN ct.LoaiSanPham = 'GoiPT' THEN gpt.TenGoiPT
                           ELSE N'Khác'
                       END as TenSanPham
                FROM dbo.ChiTietHoaDon ct
                LEFT JOIN dbo.GoiTap gt ON ct.LoaiSanPham = 'GoiTap' AND ct.MaThamChieu = gt.MaGoiTap
                LEFT JOIN dbo.GoiPT gpt ON ct.LoaiSanPham = 'GoiPT' AND ct.MaThamChieu = gpt.MaGoiPT
                WHERE ct.MaHoaDon = @MaHoaDon";

            var chiTietDt = await _dbHelper.ExecuteQueryAsync(chiTietQuery, parameters);
            hoaDon.ChiTietHoaDon = new List<ChiTietHoaDonDto>();

            foreach (DataRow row in chiTietDt.Rows)
            {
                hoaDon.ChiTietHoaDon.Add(new ChiTietHoaDonDto
                {
                    MaChiTiet = Convert.ToInt32(row["MaChiTiet"]),
                    MaHoaDon = Convert.ToInt32(row["MaHoaDon"]),
                    LoaiSanPham = row["LoaiSanPham"].ToString() ?? string.Empty,
                    MaThamChieu = Convert.ToInt32(row["MaThamChieu"]),
                    TenSanPham = row["TenSanPham"].ToString(),
                    SoLuong = Convert.ToInt32(row["SoLuong"]),
                    DonGia = Convert.ToDecimal(row["DonGia"]),
                    ThanhTien = Convert.ToDecimal(row["ThanhTien"])
                });
            }

            return hoaDon;
        }

        public async Task<IEnumerable<HoaDonDto>> GetByThanhVienAsync(int maThanhVien)
        {
            var query = @"
                SELECT h.*, 
                       tv.HoTen as TenThanhVien,
                       nv.HoTen as TenNhanVienLap
                FROM dbo.HoaDon h
                LEFT JOIN dbo.ThanhVien tv ON h.MaThanhVien = tv.MaThanhVien
                INNER JOIN dbo.NhanVien nv ON h.MaNhanVienLap = nv.MaNhanVien
                WHERE h.MaThanhVien = @MaThanhVien
                ORDER BY h.NgayLap DESC";

            var parameters = new Dictionary<string, object>
            {
                { "@MaThanhVien", maThanhVien }
            };

            var dt = await _dbHelper.ExecuteQueryAsync(query, parameters);
            var result = new List<HoaDonDto>();

            foreach (DataRow row in dt.Rows)
            {
                result.Add(MapToDto(row));
            }

            return result;
        }

        public async Task<int> CreateAsync(CreateHoaDonDto dto)
        {
            // Tính tổng tiền
            decimal tongTien = dto.ChiTietHoaDon.Sum(ct => ct.DonGia * ct.SoLuong);
            decimal soTienPhaiTra = tongTien - dto.GiamGia;

            var query = @"
                INSERT INTO dbo.HoaDon (MaThanhVien, MaNhanVienLap, TongTien, GiamGia, SoTienPhaiTra, GhiChu)
                VALUES (@MaThanhVien, @MaNhanVienLap, @TongTien, @GiamGia, @SoTienPhaiTra, @GhiChu);
                SELECT CAST(SCOPE_IDENTITY() as int);";

            var parameters = new Dictionary<string, object>
            {
                { "@MaThanhVien", (object?)dto.MaThanhVien ?? DBNull.Value },
                { "@MaNhanVienLap", dto.MaNhanVienLap },
                { "@TongTien", tongTien },
                { "@GiamGia", dto.GiamGia },
                { "@SoTienPhaiTra", soTienPhaiTra },
                { "@GhiChu", (object?)dto.GhiChu ?? DBNull.Value }
            };

            var maHoaDon = await _dbHelper.ExecuteScalarAsync<int>(query, parameters);

            // Thêm chi tiết hóa đơn
            foreach (var chiTiet in dto.ChiTietHoaDon)
            {
                var chiTietQuery = @"
                    INSERT INTO dbo.ChiTietHoaDon (MaHoaDon, LoaiSanPham, MaThamChieu, SoLuong, DonGia, ThanhTien)
                    VALUES (@MaHoaDon, @LoaiSanPham, @MaThamChieu, @SoLuong, @DonGia, @ThanhTien)";

                var chiTietParams = new Dictionary<string, object>
                {
                    { "@MaHoaDon", maHoaDon },
                    { "@LoaiSanPham", chiTiet.LoaiSanPham },
                    { "@MaThamChieu", chiTiet.MaThamChieu },
                    { "@SoLuong", chiTiet.SoLuong },
                    { "@DonGia", chiTiet.DonGia },
                    { "@ThanhTien", chiTiet.DonGia * chiTiet.SoLuong }
                };

                await _dbHelper.ExecuteNonQueryAsync(chiTietQuery, chiTietParams);
            }

            return maHoaDon;
        }

        public async Task<bool> UpdateAsync(int id, UpdateHoaDonDto dto)
        {
            var query = @"
                UPDATE dbo.HoaDon 
                SET TrangThai = @TrangThai,
                    GhiChu = @GhiChu
                WHERE MaHoaDon = @MaHoaDon";

            var parameters = new Dictionary<string, object>
            {
                { "@MaHoaDon", id },
                { "@TrangThai", dto.TrangThai },
                { "@GhiChu", (object?)dto.GhiChu ?? DBNull.Value }
            };

            var rowsAffected = await _dbHelper.ExecuteNonQueryAsync(query, parameters);
            return rowsAffected > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            // Xóa chi tiết hóa đơn trước
            var deleteChiTietQuery = "DELETE FROM dbo.ChiTietHoaDon WHERE MaHoaDon = @MaHoaDon";
            var parameters = new Dictionary<string, object>
            {
                { "@MaHoaDon", id }
            };
            await _dbHelper.ExecuteNonQueryAsync(deleteChiTietQuery, parameters);

            // Xóa hóa đơn
            var query = "DELETE FROM dbo.HoaDon WHERE MaHoaDon = @MaHoaDon";
            var rowsAffected = await _dbHelper.ExecuteNonQueryAsync(query, parameters);
            return rowsAffected > 0;
        }

        private HoaDonDto MapToDto(DataRow row)
        {
            return new HoaDonDto
            {
                MaHoaDon = Convert.ToInt32(row["MaHoaDon"]),
                MaThanhVien = row["MaThanhVien"] != DBNull.Value ? Convert.ToInt32(row["MaThanhVien"]) : null,
                TenThanhVien = row["TenThanhVien"] != DBNull.Value ? row["TenThanhVien"].ToString() : null,
                MaNhanVienLap = Convert.ToInt32(row["MaNhanVienLap"]),
                TenNhanVienLap = row["TenNhanVienLap"].ToString(),
                NgayLap = Convert.ToDateTime(row["NgayLap"]),
                TongTien = Convert.ToDecimal(row["TongTien"]),
                GiamGia = Convert.ToDecimal(row["GiamGia"]),
                SoTienPhaiTra = Convert.ToDecimal(row["SoTienPhaiTra"]),
                TrangThai = Convert.ToByte(row["TrangThai"]),
                GhiChu = row["GhiChu"] != DBNull.Value ? row["GhiChu"].ToString() : null
            };
        }
    }
}
