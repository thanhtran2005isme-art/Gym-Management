using GymManagement.API.Admin.DTOs;
using GymManagement.API.Admin.Services;
using Microsoft.AspNetCore.Mvc;

namespace GymManagement.API.Admin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ThanhToanController : ControllerBase
    {
        private readonly IThanhToanService _service;

        public ThanhToanController(IThanhToanService service)
        {
            _service = service;
        }

        [HttpGet("hoadon/{maHoaDon}")]
        public async Task<IActionResult> GetByHoaDon(int maHoaDon)
        {
            var result = await _service.GetByHoaDonAsync(maHoaDon);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateThanhToanDto dto)
        {
            var id = await _service.CreateAsync(dto);
            return Ok(new { MaThanhToan = id });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success)
                return NotFound();
            return NoContent();
        }
    }
}
