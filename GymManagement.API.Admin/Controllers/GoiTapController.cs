using Microsoft.AspNetCore.Mvc;
using GymManagement.Shared.DTOs;
using GymManagement.API.Admin.Services;

namespace GymManagement.API.Admin.Controllers
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
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GoiTapDto>> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<GoiTapDto>> Create(GoiTapDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.MaGoiTap }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<GoiTapDto>> Update(int id, GoiTapDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
