using GymManagement.API.Admin.DTOs;
using GymManagement.API.Admin.Services;
using Microsoft.AspNetCore.Mvc;

namespace GymManagement.API.Admin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiemDanhController : ControllerBase
    {
        private readonly IDiemDanhService _service;

        public DiemDanhController(IDiemDanhService service)
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
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        [HttpGet("thanhvien/{maThanhVien}")]
        public async Task<IActionResult> GetByThanhVien(int maThanhVien)
        {
            var result = await _service.GetByThanhVienAsync(maThanhVien);
            return Ok(result);
        }

        [HttpGet("date/{date}")]
        public async Task<IActionResult> GetByDate(DateTime date)
        {
            var result = await _service.GetByDateAsync(date);
            return Ok(result);
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActiveCheckIns()
        {
            var result = await _service.GetActiveCheckInsAsync();
            return Ok(result);
        }

        [HttpGet("thongke")]
        public async Task<IActionResult> GetThongKe([FromQuery] DateTime fromDate, [FromQuery] DateTime toDate)
        {
            var result = await _service.GetThongKeAsync(fromDate, toDate);
            return Ok(result);
        }

        [HttpPost("checkin")]
        public async Task<IActionResult> CheckIn([FromBody] CreateDiemDanhDto dto)
        {
            var id = await _service.CheckInAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, new { MaDiemDanh = id });
        }

        [HttpPut("{id}/checkout")]
        public async Task<IActionResult> CheckOut(int id, [FromBody] CheckOutDto dto)
        {
            var success = await _service.CheckOutAsync(id, dto);
            if (!success)
                return NotFound();
            return NoContent();
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
