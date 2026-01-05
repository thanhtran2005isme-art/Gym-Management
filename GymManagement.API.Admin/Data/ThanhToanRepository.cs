using GymManagement.API.Admin.DTOs;
using GymManagement.DbHelper;
using System.Data;

namespace GymManagement.API.Admin.Data
{
    public class ThanhToanRepository : IThanhToanRepository
    {
        private readonly SqlServerHelper _dbHelper;

        public ThanhToanRepository(SqlServerHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public async Task<IEnumerable<ThanhToanDto>> GetByHoaDonAsync(int maHoaDon)
        {
            var query = @"
                SELECT * FROM dbo.ThanhToan 
                WHERE MaHoaDon = @MaHoaDon
                ORDER BY NgayThanhToan DESC";

            var parameters = new Dictionary<string, object>
            {
                { "@MaHoaDon", maHoaDon }
            };

            var dt = await _dbHelper.ExecuteQueryAsync(query, parameters);
            var result = new List<ThanhToanDto>();

            foreach (DataRow row in dt.Rows)
            {
                result.Add(new ThanhToanDto
                {
                    MaThanhToan = Convert.ToInt32(row["MaThanhToan"]),
                    MaHoaDon = Convert.ToInt32(row["MaHoaDon"]),
                    SoTien = Convert.ToDecimal(row["SoTien"]),
                    NgayThanhToan = Convert.ToDateTime(row["NgayThanhToan"]),
                    HinhThuc = row["HinhThuc"].ToString() ?? string.Empty,
                    GhiChu = row["GhiChu"] != DBNull.Value ? row["GhiChu"].ToString() : null
                });
            }

            return result;
        }

        public async Task<int> CreateAsync(CreateThanhToanDto dto)
        {
            var query = @"
                INSERT INTO dbo.ThanhToan (MaHoaDon, SoTien, HinhThuc, GhiChu)
                VALUES (@MaHoaDon, @SoTien, @HinhThuc, @GhiChu);
                SELECT CAST(SCOPE_IDENTITY() as int);";

            var parameters = new Dictionary<string, object>
            {
                { "@MaHoaDon", dto.MaHoaDon },
                { "@SoTien", dto.SoTien },
                { "@HinhThuc", dto.HinhThuc },
                { "@GhiChu", (object?)dto.GhiChu ?? DBNull.Value }
            };

            return await _dbHelper.ExecuteScalarAsync<int>(query, parameters);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var query = "DELETE FROM dbo.ThanhToan WHERE MaThanhToan = @MaThanhToan";
            var parameters = new Dictionary<string, object>
            {
                { "@MaThanhToan", id }
            };

            var rowsAffected = await _dbHelper.ExecuteNonQueryAsync(query, parameters);
            return rowsAffected > 0;
        }
    }
}
