using System.Data;
using GymManagement.DbHelper;
using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Services
{
    public class GoiTapService : IGoiTapService
    {
        private readonly IDbHelper _db;

        public GoiTapService(IDbHelper db)
        {
            _db = db;
        }

        public async Task<IEnumerable<GoiTapDto>> GetAllAsync()
        {
            var dt = await _db.ExecuteQueryAsync(
                "SELECT MaGoiTap, TenGoiTap, SoThang, SoLanTapToiDa, Gia, MoTa, TrangThai FROM GoiTap");
            return dt.AsEnumerable().Select(row => new GoiTapDto
            {
                MaGoiTap = row.Field<int>("MaGoiTap"),
                TenGoiTap = row.Field<string>("TenGoiTap")!,
                SoThang = row.Field<int>("SoThang"),
                SoLanTapToiDa = row.Field<int?>("SoLanTapToiDa"),
                Gia = row.Field<decimal>("Gia"),
                MoTa = row.Field<string?>("MoTa"),
                TrangThai = row.Field<byte>("TrangThai")
            });
        }

        public async Task<GoiTapDto?> GetByIdAsync(int id)
        {
            var dt = await _db.ExecuteQueryAsync(
                "SELECT MaGoiTap, TenGoiTap, SoThang, SoLanTapToiDa, Gia, MoTa, TrangThai FROM GoiTap WHERE MaGoiTap = @Id",
                new Dictionary<string, object> { { "@Id", id } });
            
            var row = dt.AsEnumerable().FirstOrDefault();
            if (row == null) return null;

            return new GoiTapDto
            {
                MaGoiTap = row.Field<int>("MaGoiTap"),
                TenGoiTap = row.Field<string>("TenGoiTap")!,
                SoThang = row.Field<int>("SoThang"),
                SoLanTapToiDa = row.Field<int?>("SoLanTapToiDa"),
                Gia = row.Field<decimal>("Gia"),
                MoTa = row.Field<string?>("MoTa"),
                TrangThai = row.Field<byte>("TrangThai")
            };
        }

        public async Task<GoiTapDto> CreateAsync(GoiTapDto dto)
        {
            var id = await _db.ExecuteScalarAsync(
                @"INSERT INTO GoiTap (TenGoiTap, SoThang, SoLanTapToiDa, Gia, MoTa, TrangThai) 
                  OUTPUT INSERTED.MaGoiTap VALUES (@TenGoiTap, @SoThang, @SoLanTapToiDa, @Gia, @MoTa, @TrangThai)",
                new Dictionary<string, object>
                {
                    { "@TenGoiTap", dto.TenGoiTap },
                    { "@SoThang", dto.SoThang },
                    { "@SoLanTapToiDa", dto.SoLanTapToiDa! },
                    { "@Gia", dto.Gia },
                    { "@MoTa", dto.MoTa! },
                    { "@TrangThai", dto.TrangThai }
                });
            dto.MaGoiTap = (int)id!;
            return dto;
        }

        public async Task<GoiTapDto?> UpdateAsync(int id, GoiTapDto dto)
        {
            var rows = await _db.ExecuteNonQueryAsync(
                @"UPDATE GoiTap SET TenGoiTap = @TenGoiTap, SoThang = @SoThang, SoLanTapToiDa = @SoLanTapToiDa, 
                  Gia = @Gia, MoTa = @MoTa, TrangThai = @TrangThai WHERE MaGoiTap = @Id",
                new Dictionary<string, object>
                {
                    { "@Id", id },
                    { "@TenGoiTap", dto.TenGoiTap },
                    { "@SoThang", dto.SoThang },
                    { "@SoLanTapToiDa", dto.SoLanTapToiDa! },
                    { "@Gia", dto.Gia },
                    { "@MoTa", dto.MoTa! },
                    { "@TrangThai", dto.TrangThai }
                });
            if (rows == 0) return null;
            dto.MaGoiTap = id;
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var rows = await _db.ExecuteNonQueryAsync(
                "DELETE FROM GoiTap WHERE MaGoiTap = @Id",
                new Dictionary<string, object> { { "@Id", id } });
            return rows > 0;
        }
    }
}
