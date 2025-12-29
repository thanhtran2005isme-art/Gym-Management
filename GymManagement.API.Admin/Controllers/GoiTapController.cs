using Microsoft.AspNetCore.Mvc;
using GymManagement.API.Admin.Services;
using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoiTapController : ControllerBase
    {
        private readonly IGoiTapService _service;

        public GoiTapController(IGoiTapService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(GoiTapDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.MaGoiTap }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, GoiTapDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
