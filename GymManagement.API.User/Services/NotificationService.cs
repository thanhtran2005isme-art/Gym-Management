using GymManagement.API.User.DTOs;
using GymManagement.DbHelper;

namespace GymManagement.API.User.Services;

public class NotificationService
{
    private readonly IDbHelper _db;
    public NotificationService(IDbHelper db) => _db = db;

    public async Task<List<NotificationDto>> GetNotifications(int maThanhVien)
    {
        // Giả định có bảng ThongBao - nếu chưa có thì trả về list rỗng
        try
        {
            var sql = @"SELECT MaThongBao, TieuDe, NoiDung, NgayTao, DaDoc, LoaiThongBao
                        FROM ThongBao WHERE MaThanhVien = @MaThanhVien ORDER BY NgayTao DESC";
            return (await _db.QueryAsync<NotificationDto>(sql, new { MaThanhVien = maThanhVien })).ToList();
        }
        catch { return new List<NotificationDto>(); }
    }

    public async Task<List<NotificationDto>> GetUnreadNotifications(int maThanhVien)
    {
        try
        {
            var sql = @"SELECT MaThongBao, TieuDe, NoiDung, NgayTao, DaDoc, LoaiThongBao
                        FROM ThongBao WHERE MaThanhVien = @MaThanhVien AND DaDoc = 0 ORDER BY NgayTao DESC";
            return (await _db.QueryAsync<NotificationDto>(sql, new { MaThanhVien = maThanhVien })).ToList();
        }
        catch { return new List<NotificationDto>(); }
    }

    public async Task<bool> MarkAsRead(int maThanhVien, int id)
    {
        try
        {
            var sql = @"UPDATE ThongBao SET DaDoc = 1 WHERE MaThongBao = @Id AND MaThanhVien = @MaThanhVien";
            return await _db.ExecuteAsync(sql, new { MaThanhVien = maThanhVien, Id = id }) > 0;
        }
        catch { return false; }
    }
}
