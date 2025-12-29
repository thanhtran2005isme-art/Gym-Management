using Microsoft.AspNetCore.Mvc;
using GymManagement.API.Admin.Services;
using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoiPTController : ControllerBase
    {
        private readonly IGoiPTService _service;

        public GoiPTController(IGoiPTService service)
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
        public IActionResult Create(GoiPTDto dto)
        {
            try
            {
                var result = _service.Create(dto);
                return CreatedAtAction(nameof(GetById), new { id = result.MaGoiPT }, result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, GoiPTDto dto)
        {
            try
            {
                var result = _service.Update(id, dto);
                return result == null ? NotFound() : Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => _service.Delete(id) ? NoContent() : NotFound();

        [HttpGet("active")]
        public IActionResult GetActive() => Ok(_service.GetActive());

        [HttpGet("search")]
        public IActionResult Search([FromQuery] string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword)) return BadRequest("Keyword is required");
            return Ok(_service.Search(keyword));
        }
    }
}
