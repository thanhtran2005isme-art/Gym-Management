using GymManagement.API.Admin.DTOs;
using GymManagement.DbHelper;
using System.Data;

namespace GymManagement.API.Admin.Data
{
    public class DiemDanhRepository : IDiemDanhRepository
    {
        private readonly SqlServerHelper _dbHelper;

        public DiemDanhRepository(SqlServerHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public async Task<IEnumerable<DiemDanhDto>> GetAllAsync()
        {
            var query = @"
                SELECT dd.*, 
                       tv.HoTen as TenThanhVien,
                       tv.MaThe
                FROM dbo.DiemDanh dd
                INNER JOIN dbo.ThanhVien tv ON dd.MaThanhVien = tv.MaThanhVien
                ORDER BY dd.ThoiGianVao DESC";

            var dt = await _dbHelper.ExecuteQueryAsync(query);
            var result = new List<DiemDanhDto>();

            foreach (DataRow row in dt.Rows)
            {
                result.Add(MapToDto(row));
            }

            return result;
        }

        public async Task<DiemDanhDto?> GetByIdAsync(int id)
        {
            var query = @"
                SELECT dd.*, 
                       tv.HoTen as TenThanhVien,
                       tv.MaThe
                FROM dbo.DiemDanh dd
                INNER JOIN dbo.ThanhVien tv ON dd.MaThanhVien = tv.MaThanhVien
                WHERE dd.MaDiemDanh = @MaDiemDanh";

            var parameters = new Dictionary<string, object>
            {
                { "@MaDiemDanh", id }
            };

            var dt = await _dbHelper.ExecuteQueryAsync(query, parameters);
            if (dt.Rows.Count == 0) return null;

            return MapToDto(dt.Rows[0]);
        }

        public async Task<IEnumerable<DiemDanhDto>> GetByThanhVienAsync(int maThanhVien)
        {
            var query = @"
                SELECT dd.*, 
                       tv.HoTen as TenThanhVien,
                       tv.MaThe
                FROM dbo.DiemDanh dd
                INNER JOIN dbo.ThanhVien tv ON dd.MaThanhVien = tv.MaThanhVien
                WHERE dd.MaThanhVien = @MaThanhVien
                ORDER BY dd.ThoiGianVao DESC";

            var parameters = new Dictionary<string, object>
            {
                { "@MaThanhVien", maThanhVien }
            };

            var dt = await _dbHelper.ExecuteQueryAsync(query, parameters);
            var result = new List<DiemDanhDto>();

            foreach (DataRow row in dt.Rows)
            {
                result.Add(MapToDto(row));
            }

            return result;
        }

        public async Task<IEnumerable<DiemDanhDto>> GetByDateAsync(DateTime date)
        {
            var query = @"
                SELECT dd.*, 
                       tv.HoTen as TenThanhVien,
                       tv.MaThe
                FROM dbo.DiemDanh dd
                INNER JOIN dbo.ThanhVien tv ON dd.MaThanhVien = tv.MaThanhVien
                WHERE CAST(dd.ThoiGianVao AS DATE) = @Date
                ORDER BY dd.ThoiGianVao DESC";

            var parameters = new Dictionary<string, object>
            {
                { "@Date", date.Date }
            };

            var dt = await _dbHelper.ExecuteQueryAsync(query, parameters);
            var result = new List<DiemDanhDto>();

            foreach (DataRow row in dt.Rows)
            {
                result.Add(MapToDto(row));
            }

            return result;
        }

        public async Task<IEnumerable<DiemDanhDto>> GetActiveCheckInsAsync()
        {
            var query = @"
                SELECT dd.*, 
                       tv.HoTen as TenThanhVien,
                       tv.MaThe
                FROM dbo.DiemDanh dd
                INNER JOIN dbo.ThanhVien tv ON dd.MaThanhVien = tv.MaThanhVien
                WHERE dd.ThoiGianRa IS NULL
                ORDER BY dd.ThoiGianVao DESC";

            var dt = await _dbHelper.ExecuteQueryAsync(query);
            var result = new List<DiemDanhDto>();

            foreach (DataRow row in dt.Rows)
            {
                result.Add(MapToDto(row));
            }

            return result;
        }

        public async Task<int> CheckInAsync(CreateDiemDanhDto dto)
        {
            var query = @"
                INSERT INTO dbo.DiemDanh (MaThanhVien, HinhThuc, GhiChu)
                VALUES (@MaThanhVien, @HinhThuc, @GhiChu);
                SELECT CAST(SCOPE_IDENTITY() as int);";

            var parameters = new Dictionary<string, object>
            {
                { "@MaThanhVien", dto.MaThanhVien },
                { "@HinhThuc", (object?)dto.HinhThuc ?? DBNull.Value },
                { "@GhiChu", (object?)dto.GhiChu ?? DBNull.Value }
            };

            return await _dbHelper.ExecuteScalarAsync<int>(query, parameters);
        }

        public async Task<bool> CheckOutAsync(int id, CheckOutDto dto)
        {
            var query = @"
                UPDATE dbo.DiemDanh 
                SET ThoiGianRa = @ThoiGianRa,
                    GhiChu = CASE 
                        WHEN @GhiChu IS NOT NULL THEN @GhiChu 
                        ELSE GhiChu 
                    END
                WHERE MaDiemDanh = @MaDiemDanh";

            var parameters = new Dictionary<string, object>
            {
                { "@MaDiemDanh", id },
                { "@ThoiGianRa", dto.ThoiGianRa ?? DateTime.Now },
                { "@GhiChu", (object?)dto.GhiChu ?? DBNull.Value }
            };

            var rowsAffected = await _dbHelper.ExecuteNonQueryAsync(query, parameters);
            return rowsAffected > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var query = "DELETE FROM dbo.DiemDanh WHERE MaDiemDanh = @MaDiemDanh";
            var parameters = new Dictionary<string, object>
            {
                { "@MaDiemDanh", id }
            };

            var rowsAffected = await _dbHelper.ExecuteNonQueryAsync(query, parameters);
            return rowsAffected > 0;
        }

        public async Task<IEnumerable<DiemDanhThongKeDto>> GetThongKeAsync(DateTime fromDate, DateTime toDate)
        {
            var query = @"
                SELECT 
                    CAST(ThoiGianVao AS DATE) as Ngay,
                    COUNT(*) as SoLuotCheckIn,
                    COUNT(DISTINCT MaThanhVien) as SoThanhVienDangTap
                FROM dbo.DiemDanh
                WHERE CAST(ThoiGianVao AS DATE) BETWEEN @FromDate AND @ToDate
                GROUP BY CAST(ThoiGianVao AS DATE)
                ORDER BY Ngay DESC";

            var parameters = new Dictionary<string, object>
            {
                { "@FromDate", fromDate.Date },
                { "@ToDate", toDate.Date }
            };

            var dt = await _dbHelper.ExecuteQueryAsync(query, parameters);
            var result = new List<DiemDanhThongKeDto>();

            foreach (DataRow row in dt.Rows)
            {
                result.Add(new DiemDanhThongKeDto
                {
                    Ngay = Convert.ToDateTime(row["Ngay"]),
                    SoLuotCheckIn = Convert.ToInt32(row["SoLuotCheckIn"]),
                    SoThanhVienDangTap = Convert.ToInt32(row["SoThanhVienDangTap"])
                });
            }

            return result;
        }

        private DiemDanhDto MapToDto(DataRow row)
        {
            return new DiemDanhDto
            {
                MaDiemDanh = Convert.ToInt32(row["MaDiemDanh"]),
                MaThanhVien = Convert.ToInt32(row["MaThanhVien"]),
                TenThanhVien = row["TenThanhVien"].ToString(),
                MaThe = row["MaThe"] != DBNull.Value ? row["MaThe"].ToString() : null,
                ThoiGianVao = Convert.ToDateTime(row["ThoiGianVao"]),
                ThoiGianRa = row["ThoiGianRa"] != DBNull.Value ? Convert.ToDateTime(row["ThoiGianRa"]) : null,
                HinhThuc = row["HinhThuc"] != DBNull.Value ? row["HinhThuc"].ToString() : null,
                GhiChu = row["GhiChu"] != DBNull.Value ? row["GhiChu"].ToString() : null
            };
        }
    }
}
