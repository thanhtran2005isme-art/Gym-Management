using Microsoft.AspNetCore.Mvc;
using GymManagement.API.Trainer.DTOs;
using GymManagement.API.Trainer.Services;

namespace GymManagement.API.Trainer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoiPTController : ControllerBase
    {
        private readonly IGoiPTService _goiPTService;

        public GoiPTController(IGoiPTService goiPTService)
        {
            _goiPTService = goiPTService;
        }

        /// <summary>
        /// Xem danh sách gói PT
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<GoiPTDto>>> GetAll()
        {
            var goiPTs = await _goiPTService.GetAllAsync();
            return Ok(goiPTs);
        }

        /// <summary>
        /// Xem chi tiết gói PT
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<GoiPTDto>> GetById(int id)
        {
            var goiPT = await _goiPTService.GetByIdAsync(id);
            if (goiPT == null)
                return NotFound(new { message = "Không tìm thấy gói PT" });
            return Ok(goiPT);
        }

        /// <summary>
        /// Xem gói PT đang hoạt động
        /// </summary>
        [HttpGet("active")]
        public async Task<ActionResult<List<GoiPTDto>>> GetActive()
        {
            var goiPTs = await _goiPTService.GetActiveAsync();
            return Ok(goiPTs);
        }
    }
}
