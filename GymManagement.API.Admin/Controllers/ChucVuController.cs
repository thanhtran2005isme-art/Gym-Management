using Microsoft.AspNetCore.Mvc;
using GymManagement.API.Admin.Services;
using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChucVuController : ControllerBase
    {
        private readonly IChucVuService _service;

        public ChucVuController(IChucVuService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAll() => Ok(_service.GetAll());

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var result = _service.GetById(id);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpPost]
        public IActionResult Create(ChucVuDto dto)
        {
            var result = _service.Create(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.MaChucVu }, result);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, ChucVuDto dto)
        {
            var result = _service.Update(id, dto);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => _service.Delete(id) ? NoContent() : NotFound();
    }
}
