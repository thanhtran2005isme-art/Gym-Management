using GymManagement.API.Admin.DTOs;
using GymManagement.DbHelper;
using System.Data;

namespace GymManagement.API.Admin.Data
{
    public class BuoiTapRepository : IBuoiTapRepository
    {
        private readonly SqlServerHelper _dbHelper;

        public BuoiTapRepository(SqlServerHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public async Task<IEnumerable<BuoiTapDto>> GetAllAsync()
        {
            var sql = @"
                SELECT bt.MaBuoiTap, bt.MaThanhVien, tv.HoTen AS TenThanhVien,
                       bt.MaHopDong, bt.NgayTap, bt.ThoiGianBatDau, 
                       bt.ThoiGianKetThuc, bt.GhiChu
                FROM dbo.BuoiTap bt
                INNER JOIN dbo.ThanhVien tv ON bt.MaThanhVien = tv.MaThanhVien
                ORDER BY bt.NgayTap DESC, bt.ThoiGianBatDau DESC";

            var dt = await _dbHelper.ExecuteQueryAsync(sql);
            return MapDataTableToList(dt);
        }

        public async Task<BuoiTapDto?> GetByIdAsync(int maBuoiTap)
        {
            var sql = @"
                SELECT bt.MaBuoiTap, bt.MaThanhVien, tv.HoTen AS TenThanhVien,
                       bt.MaHopDong, bt.NgayTap, bt.ThoiGianBatDau, 
                       bt.ThoiGianKetThuc, bt.GhiChu
                FROM dbo.BuoiTap bt
                INNER JOIN dbo.ThanhVien tv ON bt.MaThanhVien = tv.MaThanhVien
                WHERE bt.MaBuoiTap = @MaBuoiTap";

            var parameters = new Dictionary<string, object>
            {
                { "@MaBuoiTap", maBuoiTap }
            };

            var dt = await _dbHelper.ExecuteQueryAsync(sql, parameters);
            var list = MapDataTableToList(dt);
            return list.FirstOrDefault();
        }

        public async Task<IEnumerable<BuoiTapDto>> GetByThanhVienAsync(int maThanhVien)
        {
            var sql = @"
                SELECT bt.MaBuoiTap, bt.MaThanhVien, tv.HoTen AS TenThanhVien,
                       bt.MaHopDong, bt.NgayTap, bt.ThoiGianBatDau, 
                       bt.ThoiGianKetThuc, bt.GhiChu
                FROM dbo.BuoiTap bt
                INNER JOIN dbo.ThanhVien tv ON bt.MaThanhVien = tv.MaThanhVien
                WHERE bt.MaThanhVien = @MaThanhVien
                ORDER BY bt.NgayTap DESC, bt.ThoiGianBatDau DESC";

            var parameters = new Dictionary<string, object>
            {
                { "@MaThanhVien", maThanhVien }
            };

            var dt = await _dbHelper.ExecuteQueryAsync(sql, parameters);
            return MapDataTableToList(dt);
        }

        public async Task<IEnumerable<BuoiTapDto>> GetByDateRangeAsync(DateTime tuNgay, DateTime denNgay)
        {
            var sql = @"
                SELECT bt.MaBuoiTap, bt.MaThanhVien, tv.HoTen AS TenThanhVien,
                       bt.MaHopDong, bt.NgayTap, bt.ThoiGianBatDau, 
                       bt.ThoiGianKetThuc, bt.GhiChu
                FROM dbo.BuoiTap bt
                INNER JOIN dbo.ThanhVien tv ON bt.MaThanhVien = tv.MaThanhVien
                WHERE bt.NgayTap BETWEEN @TuNgay AND @DenNgay
                ORDER BY bt.NgayTap DESC, bt.ThoiGianBatDau DESC";

            var parameters = new Dictionary<string, object>
            {
                { "@TuNgay", tuNgay.Date },
                { "@DenNgay", denNgay.Date }
            };

            var dt = await _dbHelper.ExecuteQueryAsync(sql, parameters);
            return MapDataTableToList(dt);
        }

        public async Task<int> CreateAsync(CreateBuoiTapDto dto)
        {
            var sql = @"
                INSERT INTO dbo.BuoiTap (MaThanhVien, MaHopDong, NgayTap, ThoiGianBatDau, ThoiGianKetThuc, GhiChu)
                VALUES (@MaThanhVien, @MaHopDong, @NgayTap, @ThoiGianBatDau, @ThoiGianKetThuc, @GhiChu);
                SELECT CAST(SCOPE_IDENTITY() AS INT);";

            var parameters = new Dictionary<string, object>
            {
                { "@MaThanhVien", dto.MaThanhVien },
                { "@MaHopDong", dto.MaHopDong ?? (object)DBNull.Value },
                { "@NgayTap", dto.NgayTap.Date },
                { "@ThoiGianBatDau", dto.ThoiGianBatDau ?? (object)DBNull.Value },
                { "@ThoiGianKetThuc", dto.ThoiGianKetThuc ?? (object)DBNull.Value },
                { "@GhiChu", dto.GhiChu ?? (object)DBNull.Value }
            };

            var result = await _dbHelper.ExecuteScalarAsync(sql, parameters);
            return Convert.ToInt32(result);
        }

        public async Task<bool> UpdateAsync(int maBuoiTap, UpdateBuoiTapDto dto)
        {
            var sql = @"
                UPDATE dbo.BuoiTap
                SET MaHopDong = COALESCE(@MaHopDong, MaHopDong),
                    NgayTap = COALESCE(@NgayTap, NgayTap),
                    ThoiGianBatDau = COALESCE(@ThoiGianBatDau, ThoiGianBatDau),
                    ThoiGianKetThuc = COALESCE(@ThoiGianKetThuc, ThoiGianKetThuc),
                    GhiChu = COALESCE(@GhiChu, GhiChu)
                WHERE MaBuoiTap = @MaBuoiTap";

            var parameters = new Dictionary<string, object>
            {
                { "@MaBuoiTap", maBuoiTap },
                { "@MaHopDong", dto.MaHopDong ?? (object)DBNull.Value },
                { "@NgayTap", dto.NgayTap?.Date ?? (object)DBNull.Value },
                { "@ThoiGianBatDau", dto.ThoiGianBatDau ?? (object)DBNull.Value },
                { "@ThoiGianKetThuc", dto.ThoiGianKetThuc ?? (object)DBNull.Value },
                { "@GhiChu", dto.GhiChu ?? (object)DBNull.Value }
            };

            var rowsAffected = await _dbHelper.ExecuteNonQueryAsync(sql, parameters);
            return rowsAffected > 0;
        }

        public async Task<bool> DeleteAsync(int maBuoiTap)
        {
            var sql = "DELETE FROM dbo.BuoiTap WHERE MaBuoiTap = @MaBuoiTap";
            var parameters = new Dictionary<string, object>
            {
                { "@MaBuoiTap", maBuoiTap }
            };

            var rowsAffected = await _dbHelper.ExecuteNonQueryAsync(sql, parameters);
            return rowsAffected > 0;
        }

        private List<BuoiTapDto> MapDataTableToList(DataTable dt)
        {
            var list = new List<BuoiTapDto>();
            foreach (DataRow row in dt.Rows)
            {
                list.Add(new BuoiTapDto
                {
                    MaBuoiTap = Convert.ToInt32(row["MaBuoiTap"]),
                    MaThanhVien = Convert.ToInt32(row["MaThanhVien"]),
                    TenThanhVien = row["TenThanhVien"]?.ToString(),
                    MaHopDong = row["MaHopDong"] != DBNull.Value ? Convert.ToInt32(row["MaHopDong"]) : null,
                    NgayTap = Convert.ToDateTime(row["NgayTap"]),
                    ThoiGianBatDau = row["ThoiGianBatDau"] != DBNull.Value ? Convert.ToDateTime(row["ThoiGianBatDau"]) : null,
                    ThoiGianKetThuc = row["ThoiGianKetThuc"] != DBNull.Value ? Convert.ToDateTime(row["ThoiGianKetThuc"]) : null,
                    GhiChu = row["GhiChu"]?.ToString()
                });
            }
            return list;
        }
    }
}
