using Microsoft.AspNetCore.Mvc;
using GymManagement.Shared.DTOs;
using GymManagement.API.User.Services;

namespace GymManagement.API.User.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckInController : ControllerBase
    {
        private readonly ICheckInService _service;

        public CheckInController(ICheckInService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<CheckInDto>> CheckIn(CheckInRequest request)
        {
            try
            {
                var result = await _service.CheckInAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("checkout")]
        public async Task<ActionResult<CheckInDto>> CheckOut(CheckOutRequest request)
        {
            var result = await _service.CheckOutAsync(request);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("history/{maThanhVien}")]
        public async Task<ActionResult<IEnumerable<CheckInDto>>> GetHistory(int maThanhVien)
        {
            var result = await _service.GetHistoryByMemberAsync(maThanhVien);
            return Ok(result);
        }

        [HttpGet("current/{maThanhVien}")]
        public async Task<ActionResult<CheckInDto>> GetCurrent(int maThanhVien)
        {
            var result = await _service.GetCurrentCheckInAsync(maThanhVien);
            if (result == null) return NotFound(new { message = "Thành viên chưa check-in" });
            return Ok(result);
        }
    }
}
