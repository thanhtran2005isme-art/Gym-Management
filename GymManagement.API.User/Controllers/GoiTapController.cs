using Microsoft.AspNetCore.Mvc;
using GymManagement.Shared.DTOs;
using GymManagement.API.User.Services;

namespace GymManagement.API.User.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoiTapController : ControllerBase
    {
        private readonly IGoiTapService _service;

        public GoiTapController(IGoiTapService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GoiTapDto>>> GetAll()
        {
            var result = await _service.GetAllActiveAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GoiTapDto>> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }
    }
}
