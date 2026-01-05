using GymManagement.API.Admin.DTOs;
using GymManagement.DbHelper;

namespace GymManagement.API.Admin.Data
{
    public class DangKyGoiTapRepository : IDangKyGoiTapRepository
    {
        private readonly IDbHelper _db;

        public DangKyGoiTapRepository(IDbHelper db)
        {
            _db = db;
        }

        public List<DangKyGoiTapDto> GetAll()
        {
            var sql = @"SELECT dk.*, tv.HoTen AS TenThanhVien, tv.MaThe, gt.TenGoiTap 
                        FROM DangKyGoiTap dk
                        INNER JOIN ThanhVien tv ON dk.MaThanhVien = tv.MaThanhVien
                        INNER JOIN GoiTap gt ON dk.MaGoiTap = gt.MaGoiTap
                        ORDER BY dk.MaDangKy DESC";
            var dt = _db.ExecuteQuery(sql);
            return MapList(dt);
        }

        public DangKyGoiTapDto? GetById(int id)
        {
            var sql = @"SELECT dk.*, tv.HoTen AS TenThanhVien, tv.MaThe, gt.TenGoiTap 
                        FROM DangKyGoiTap dk
                        INNER JOIN ThanhVien tv ON dk.MaThanhVien = tv.MaThanhVien
                        INNER JOIN GoiTap gt ON dk.MaGoiTap = gt.MaGoiTap
                        WHERE dk.MaDangKy = @Id";
            var dt = _db.ExecuteQuery(sql, "@Id", id);
            return dt.Rows.Count == 0 ? null : MapToDto(dt.Rows[0]);
        }

        public List<DangKyGoiTapDto> GetByThanhVien(int maThanhVien)
        {
            var sql = @"SELECT dk.*, tv.HoTen AS TenThanhVien, tv.MaThe, gt.TenGoiTap 
                        FROM DangKyGoiTap dk
                        INNER JOIN ThanhVien tv ON dk.MaThanhVien = tv.MaThanhVien
                        INNER JOIN GoiTap gt ON dk.MaGoiTap = gt.MaGoiTap
                        WHERE dk.MaThanhVien = @MaTV ORDER BY dk.NgayDangKy DESC";
            var dt = _db.ExecuteQuery(sql, "@MaTV", maThanhVien);
            return MapList(dt);
        }

        public DangKyGoiTapDto? GetActiveByThanhVien(int maThanhVien)
        {
            var sql = @"SELECT dk.*, tv.HoTen AS TenThanhVien, tv.MaThe, gt.TenGoiTap 
                        FROM DangKyGoiTap dk
                        INNER JOIN ThanhVien tv ON dk.MaThanhVien = tv.MaThanhVien
                        INNER JOIN GoiTap gt ON dk.MaGoiTap = gt.MaGoiTap
                        WHERE dk.MaThanhVien = @MaTV AND dk.TrangThai = 1 AND dk.NgayKetThuc >= CAST(GETDATE() AS DATE)";
            var dt = _db.ExecuteQuery(sql, "@MaTV", maThanhVien);
            return dt.Rows.Count == 0 ? null : MapToDto(dt.Rows[0]);
        }

        public int Create(int maThanhVien, int maGoiTap, DateTime ngayBatDau, DateTime ngayKetThuc, int? soLanTap, decimal tongTien, string? ghiChu)
        {
            var sql = @"INSERT INTO DangKyGoiTap (MaThanhVien, MaGoiTap, NgayBatDau, NgayKetThuc, SoLanTapConLai, TongTien, GhiChu, TrangThai)
                        VALUES (@MaTV, @MaGT, @NgayBD, @NgayKT, @SoLan, @Tien, @GhiChu, 1);
                        SELECT SCOPE_IDENTITY();";
            var id = _db.ExecuteScalar(sql,
                "@MaTV", maThanhVien, "@MaGT", maGoiTap,
                "@NgayBD", ngayBatDau, "@NgayKT", ngayKetThuc,
                "@SoLan", soLanTap, "@Tien", tongTien, "@GhiChu", ghiChu);
            return Convert.ToInt32(id);
        }

        public bool UpdateTrangThai(int id, byte trangThai)
        {
            return _db.ExecuteNonQuery("UPDATE DangKyGoiTap SET TrangThai = @TT WHERE MaDangKy = @Id", "@TT", trangThai, "@Id", id) > 0;
        }

        public List<DangKyGoiTapDto> GetSapHetHan(int soNgay)
        {
            var sql = @"SELECT dk.*, tv.HoTen AS TenThanhVien, tv.MaThe, gt.TenGoiTap 
                        FROM DangKyGoiTap dk
                        INNER JOIN ThanhVien tv ON dk.MaThanhVien = tv.MaThanhVien
                        INNER JOIN GoiTap gt ON dk.MaGoiTap = gt.MaGoiTap
                        WHERE dk.TrangThai = 1 
                        AND dk.NgayKetThuc BETWEEN CAST(GETDATE() AS DATE) AND DATEADD(DAY, @SoNgay, CAST(GETDATE() AS DATE))
                        ORDER BY dk.NgayKetThuc";
            var dt = _db.ExecuteQuery(sql, "@SoNgay", soNgay);
            return MapList(dt);
        }

        public List<DangKyGoiTapDto> GetActive()
        {
            var sql = @"SELECT dk.*, tv.HoTen AS TenThanhVien, tv.MaThe, gt.TenGoiTap 
                        FROM DangKyGoiTap dk
                        INNER JOIN ThanhVien tv ON dk.MaThanhVien = tv.MaThanhVien
                        INNER JOIN GoiTap gt ON dk.MaGoiTap = gt.MaGoiTap
                        WHERE dk.TrangThai = 1 AND dk.NgayKetThuc >= CAST(GETDATE() AS DATE)
                        ORDER BY dk.NgayKetThuc";
            var dt = _db.ExecuteQuery(sql);
            return MapList(dt);
        }

        public (List<DangKyGoiTapDto> Items, int Total) GetPaged(int page, int pageSize)
        {
            var offset = (page - 1) * pageSize;
            var sql = @"SELECT dk.*, tv.HoTen AS TenThanhVien, tv.MaThe, gt.TenGoiTap 
                        FROM DangKyGoiTap dk
                        INNER JOIN ThanhVien tv ON dk.MaThanhVien = tv.MaThanhVien
                        INNER JOIN GoiTap gt ON dk.MaGoiTap = gt.MaGoiTap
                        ORDER BY dk.MaDangKy DESC
                        OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";
            var dt = _db.ExecuteQuery(sql, "@Offset", offset, "@PageSize", pageSize);
            var countDt = _db.ExecuteQuery("SELECT COUNT(*) FROM DangKyGoiTap");
            var total = Convert.ToInt32(countDt.Rows[0][0]);
            return (MapList(dt), total);
        }

        private List<DangKyGoiTapDto> MapList(System.Data.DataTable dt)
        {
            var list = new List<DangKyGoiTapDto>();
            foreach (System.Data.DataRow row in dt.Rows)
                list.Add(MapToDto(row));
            return list;
        }

        private DangKyGoiTapDto MapToDto(System.Data.DataRow row)
        {
            return new DangKyGoiTapDto
            {
                MaDangKy = Convert.ToInt32(row["MaDangKy"]),
                MaThanhVien = Convert.ToInt32(row["MaThanhVien"]),
                TenThanhVien = row["TenThanhVien"]?.ToString(),
                MaThe = row["MaThe"]?.ToString(),
                MaGoiTap = Convert.ToInt32(row["MaGoiTap"]),
                TenGoiTap = row["TenGoiTap"]?.ToString(),
                NgayDangKy = Convert.ToDateTime(row["NgayDangKy"]),
                NgayBatDau = Convert.ToDateTime(row["NgayBatDau"]),
                NgayKetThuc = Convert.ToDateTime(row["NgayKetThuc"]),
                SoLanTapConLai = row["SoLanTapConLai"] == DBNull.Value ? null : Convert.ToInt32(row["SoLanTapConLai"]),
                TongTien = Convert.ToDecimal(row["TongTien"]),
                GhiChu = row["GhiChu"]?.ToString(),
                TrangThai = Convert.ToByte(row["TrangThai"])
            };
        }
    }
}
