using GymManagement.API.User.DTOs;
using GymManagement.API.User.Services;
using Microsoft.AspNetCore.Mvc;

namespace GymManagement.API.User.Controllers;

[ApiController]
[Route("api/dang-ky")]
public class DangKyGoiTapController : ControllerBase
{
    private readonly DangKyGoiTapService _service;
    public DangKyGoiTapController(DangKyGoiTapService service) => _service = service;

    // Đăng ký gói tập
    [HttpPost("goi-tap")]
    public async Task<IActionResult> DangKyGoiTap([FromHeader(Name = "X-User-Id")] int maThanhVien, [FromBody] DangKyGoiTapRequest request)
    {
        if (maThanhVien <= 0)
            return Unauthorized(new { message = "Vui lòng đăng nhập" });

        var result = await _service.DangKyGoiTap(maThanhVien, request);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    // Đăng ký gói PT
    [HttpPost("goi-pt")]
    public async Task<IActionResult> DangKyGoiPT([FromHeader(Name = "X-User-Id")] int maThanhVien, [FromBody] DangKyGoiPTRequest request)
    {
        if (maThanhVien <= 0)
            return Unauthorized(new { message = "Vui lòng đăng nhập" });

        var result = await _service.DangKyGoiPT(maThanhVien, request);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    // Hủy gói tập
    [HttpDelete("goi-tap/{maHopDong}")]
    public async Task<IActionResult> HuyGoiTap([FromHeader(Name = "X-User-Id")] int maThanhVien, int maHopDong)
    {
        if (maThanhVien <= 0)
            return Unauthorized(new { message = "Vui lòng đăng nhập" });

        var result = await _service.HuyGoiTap(maThanhVien, maHopDong);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    // Hủy gói PT
    [HttpDelete("goi-pt/{maHopDong}")]
    public async Task<IActionResult> HuyGoiPT([FromHeader(Name = "X-User-Id")] int maThanhVien, int maHopDong)
    {
        if (maThanhVien <= 0)
            return Unauthorized(new { message = "Vui lòng đăng nhập" });

        var result = await _service.HuyGoiPT(maThanhVien, maHopDong);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
