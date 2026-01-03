using GymManagement.API.User.DTOs;
using GymManagement.API.User.Services;
using Microsoft.AspNetCore.Mvc;

namespace GymManagement.API.User.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LopHocNhomController : ControllerBase
{
    private readonly LopHocNhomService _service;
    public LopHocNhomController(LopHocNhomService service) => _service = service;

    // GET: api/LopHocNhom
    [HttpGet]
    public async Task<IActionResult> GetDanhSachLopHoc()
    {
        var result = await _service.GetDanhSachLopHoc();
        return Ok(result);
    }

    // GET: api/LopHocNhom/lich?maLopHoc=1
    [HttpGet("lich")]
    public async Task<IActionResult> GetLichLopNhom([FromQuery] int? maLopHoc)
    {
        var result = await _service.GetLichLopNhom(maLopHoc);
        return Ok(result);
    }

    // POST: api/LopHocNhom/dangky/{maThanhVien}
    [HttpPost("dangky/{maThanhVien}")]
    public async Task<IActionResult> DangKyLop(int maThanhVien, [FromBody] DangKyLopNhomRequestDto dto)
    {
        var id = await _service.DangKyLop(maThanhVien, dto);
        return Ok(new { MaDangKy = id, Message = "Đăng ký thành công" });
    }

    // GET: api/LopHocNhom/dangky/{maThanhVien}
    [HttpGet("dangky/{maThanhVien}")]
    public async Task<IActionResult> GetDangKyByThanhVien(int maThanhVien)
    {
        var result = await _service.GetDangKyByThanhVien(maThanhVien);
        return Ok(result);
    }

    // DELETE: api/LopHocNhom/dangky/{maDangKy}/{maThanhVien}
    [HttpDelete("dangky/{maDangKy}/{maThanhVien}")]
    public async Task<IActionResult> HuyDangKy(int maDangKy, int maThanhVien)
    {
        var result = await _service.HuyDangKy(maDangKy, maThanhVien);
        return result ? Ok(new { Message = "Hủy đăng ký thành công" }) : BadRequest("Không thể hủy");
    }
}
