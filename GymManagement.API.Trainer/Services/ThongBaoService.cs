using GymManagement.API.Trainer.DTOs;

namespace GymManagement.API.Trainer.Services
{
    public class ThongBaoService : IThongBaoService
    {
        private static List<ThongBaoDto> _thongBaos = new()
        {
            new ThongBaoDto
            {
                Id = 1,
                TieuDe = "Buổi tập mới được đặt",
                NoiDung = "Học viên Trần Văn B đã đặt buổi tập vào ngày 10/01/2026",
                LoaiThongBao = "Schedule",
                DaDoc = false,
                NgayTao = DateTime.Now.AddHours(-2),
                Link = "/buoi-tap/1"
            },
            new ThongBaoDto
            {
                Id = 2,
                TieuDe = "Hợp đồng sắp hết hạn",
                NoiDung = "Hợp đồng HD001 của học viên Lê Thị C sẽ hết hạn trong 7 ngày",
                LoaiThongBao = "Contract",
                DaDoc = false,
                NgayTao = DateTime.Now.AddDays(-1),
                Link = "/hop-dong/1"
            },
            new ThongBaoDto
            {
                Id = 3,
                TieuDe = "Nhắc nhở buổi tập",
                NoiDung = "Bạn có buổi tập với học viên Nguyễn Văn D lúc 14:00 hôm nay",
                LoaiThongBao = "Reminder",
                DaDoc = true,
                NgayTao = DateTime.Now.AddHours(-5),
                NgayDoc = DateTime.Now.AddHours(-4),
                Link = "/buoi-tap/2"
            }
        };

        public async Task<List<ThongBaoDto>> GetMyNotificationsAsync(int trainerId)
        {
            return await Task.FromResult(_thongBaos.OrderByDescending(t => t.NgayTao).ToList());
        }

        public async Task<bool> MarkAsReadAsync(int id)
        {
            var thongBao = _thongBaos.FirstOrDefault(t => t.Id == id);
            if (thongBao == null) return false;

            thongBao.DaDoc = true;
            thongBao.NgayDoc = DateTime.Now;
            return await Task.FromResult(true);
        }

        public async Task<UnreadCountDto> GetUnreadCountAsync(int trainerId)
        {
            var count = _thongBaos.Count(t => !t.DaDoc);
            return await Task.FromResult(new UnreadCountDto { SoThongBaoChuaDoc = count });
        }
    }
}
