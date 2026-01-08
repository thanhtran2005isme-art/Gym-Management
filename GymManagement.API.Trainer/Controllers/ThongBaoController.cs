using Microsoft.AspNetCore.Mvc;
using GymManagement.API.Trainer.DTOs;
using GymManagement.API.Trainer.Services;

namespace GymManagement.API.Trainer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ThongBaoController : ControllerBase
    {
        private readonly IThongBaoService _thongBaoService;
        private const int CurrentTrainerId = 1; // TODO: Lấy từ JWT token

        public ThongBaoController(IThongBaoService thongBaoService)
        {
            _thongBaoService = thongBaoService;
        }

        /// <summary>
        /// Xem thông báo của PT
        /// </summary>
        [HttpGet("my-notifications")]
        public async Task<ActionResult<List<ThongBaoDto>>> GetMyNotifications()
        {
            var notifications = await _thongBaoService.GetMyNotificationsAsync(CurrentTrainerId);
            return Ok(notifications);
        }

        /// <summary>
        /// Đánh dấu đã đọc
        /// </summary>
        [HttpPut("{id}/mark-read")]
        public async Task<ActionResult> MarkAsRead(int id)
        {
            var result = await _thongBaoService.MarkAsReadAsync(id);
            if (!result)
                return NotFound(new { message = "Không tìm thấy thông báo" });
            return Ok(new { message = "Đã đánh dấu đã đọc" });
        }

        /// <summary>
        /// Số thông báo chưa đọc
        /// </summary>
        [HttpGet("unread-count")]
        public async Task<ActionResult<UnreadCountDto>> GetUnreadCount()
        {
            var count = await _thongBaoService.GetUnreadCountAsync(CurrentTrainerId);
            return Ok(count);
        }
    }
}
