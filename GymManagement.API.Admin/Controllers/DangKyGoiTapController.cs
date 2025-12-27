using Microsoft.AspNetCore.Mvc;
using GymManagement.API.Admin.Services;
using GymManagement.API.Admin.DTOs;

namespace GymManagement.API.Admin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DangKyGoiTapController : ControllerBase
    {
        private readonly IDangKyGoiTapService _service;

        public DangKyGoiTapController(IDangKyGoiTapService service)
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

        [HttpGet("by-thanhvien/{maThanhVien}")]
        public IActionResult GetByThanhVien(int maThanhVien) => Ok(_service.GetByThanhVien(maThanhVien));

        [HttpGet("active-by-thanhvien/{maThanhVien}")]
        public IActionResult GetActiveByThanhVien(int maThanhVien)
        {
            var result = _service.GetActiveByThanhVien(maThanhVien);
            return result == null ? NotFound("Thành viên không có gói tập đang hoạt động") : Ok(result);
        }

        [HttpPost]
        public IActionResult Create(DangKyGoiTapCreateDto dto)
        {
            try
            {
                var result = _service.Create(dto);
                return CreatedAtAction(nameof(GetById), new { id = result.MaDangKy }, result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("gia-han")]
        public IActionResult GiaHan(GiaHanGoiTapDto dto)
        {
            try
            {
                var result = _service.GiaHan(dto);
                return result == null ? NotFound("Không tìm thấy đăng ký gốc") : Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}/huy")]
        public IActionResult HuyDangKy(int id) => _service.HuyDangKy(id) ? NoContent() : NotFound();

        [HttpGet("sap-het-han")]
        public IActionResult GetSapHetHan([FromQuery] int soNgay = 7) => Ok(_service.GetSapHetHan(soNgay));

        [HttpGet("active")]
        public IActionResult GetActive() => Ok(_service.GetActive());

        [HttpGet("paged")]
        public IActionResult GetPaged([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;
            var (items, total) = _service.GetPaged(page, pageSize);
            return Ok(new { Items = items, Total = total, Page = page, PageSize = pageSize });
        }
    }
}
