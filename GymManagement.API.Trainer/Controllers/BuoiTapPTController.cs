using Microsoft.AspNetCore.Mvc;
using GymManagement.API.Trainer.DTOs;
using GymManagement.API.Trainer.Services;

namespace GymManagement.API.Trainer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BuoiTapPTController : ControllerBase
    {
        private readonly IBuoiTapPTService _buoiTapService;
        private const int CurrentTrainerId = 1; // TODO: Lấy từ JWT token

        public BuoiTapPTController(IBuoiTapPTService buoiTapService)
        {
            _buoiTapService = buoiTapService;
        }

        /// <summary>
        /// Xem lịch dạy của PT
        /// </summary>
        [HttpGet("my-schedule")]
        public async Task<ActionResult<List<BuoiTapPTDto>>> GetMySchedule()
        {
            var schedule = await _buoiTapService.GetMyScheduleAsync(CurrentTrainerId);
            return Ok(schedule);
        }

        /// <summary>
        /// Xem lịch theo ngày
        /// </summary>
        [HttpGet("by-date")]
        public async Task<ActionResult<List<BuoiTapPTDto>>> GetByDate([FromQuery] DateTime date)
        {
            var sessions = await _buoiTapService.GetByDateAsync(CurrentTrainerId, date);
            return Ok(sessions);
        }

        /// <summary>
        /// Xem buổi tập sắp tới
        /// </summary>
        [HttpGet("upcoming")]
        public async Task<ActionResult<List<BuoiTapPTDto>>> GetUpcoming()
        {
            var sessions = await _buoiTapService.GetUpcomingAsync(CurrentTrainerId);
            return Ok(sessions);
        }

        /// <summary>
        /// Xem chi tiết buổi tập
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<BuoiTapPTDto>> GetById(int id)
        {
            var session = await _buoiTapService.GetByIdAsync(id);
            if (session == null)
                return NotFound(new { message = "Không tìm thấy buổi tập" });
            return Ok(session);
        }

        /// <summary>
        /// Tạo buổi tập mới
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<BuoiTapPTDto>> Create([FromBody] CreateBuoiTapPTDto dto)
        {
            var session = await _buoiTapService.CreateAsync(CurrentTrainerId, dto);
            return CreatedAtAction(nameof(GetById), new { id = session.Id }, session);
        }

        /// <summary>
        /// Cập nhật buổi tập
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<BuoiTapPTDto>> Update(int id, [FromBody] UpdateBuoiTapPTDto dto)
        {
            var session = await _buoiTapService.UpdateAsync(id, dto);
            if (session == null)
                return NotFound(new { message = "Không tìm thấy buổi tập" });
            return Ok(session);
        }

        /// <summary>
        /// Hủy buổi tập
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _buoiTapService.DeleteAsync(id);
            if (!result)
                return NotFound(new { message = "Không tìm thấy buổi tập" });
            return NoContent();
        }

        /// <summary>
        /// Đánh dấu hoàn thành buổi tập
        /// </summary>
        [HttpPut("{id}/complete")]
        public async Task<ActionResult<BuoiTapPTDto>> Complete(int id)
        {
            var session = await _buoiTapService.CompleteAsync(id);
            if (session == null)
                return NotFound(new { message = "Không tìm thấy buổi tập" });
            return Ok(session);
        }

        /// <summary>
        /// Xem lịch sử buổi tập
        /// </summary>
        [HttpGet("history")]
        public async Task<ActionResult<List<BuoiTapPTDto>>> GetHistory([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var sessions = await _buoiTapService.GetHistoryAsync(CurrentTrainerId, from, to);
            return Ok(sessions);
        }
    }
}
