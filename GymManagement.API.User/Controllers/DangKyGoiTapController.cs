using Microsoft.AspNetCore.Mvc;
using GymManagement.Shared.DTOs;
using GymManagement.API.User.Services;

namespace GymManagement.API.User.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DangKyGoiTapController : ControllerBase
    {
        private readonly IDangKyGoiTapService _service;

        public DangKyGoiTapController(IDangKyGoiTapService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<DangKyGoiTapDto>> DangKy(DangKyGoiTapRequest request)
        {
            try
            {
                var result = await _service.DangKyAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("member/{maThanhVien}")]
        public async Task<ActionResult<IEnumerable<DangKyGoiTapDto>>> GetByMember(int maThanhVien)
        {
            var result = await _service.GetByMemberAsync(maThanhVien);
            return Ok(result);
        }

        [HttpGet("active/{maThanhVien}")]
        public async Task<ActionResult<DangKyGoiTapDto>> GetActivePackage(int maThanhVien)
        {
            var result = await _service.GetActivePackageAsync(maThanhVien);
            if (result == null) return NotFound(new { message = "Không có gói tập đang hoạt động" });
            return Ok(result);
        }

        [HttpDelete("{maDangKy}")]
        public async Task<IActionResult> HuyDangKy(int maDangKy)
        {
            var success = await _service.HuyDangKyAsync(maDangKy);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
