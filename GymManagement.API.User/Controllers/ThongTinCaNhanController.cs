using GymManagement.API.User.DTOs;
using GymManagement.API.User.Services;
using Microsoft.AspNetCore.Mvc;

namespace GymManagement.API.User.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ThongTinCaNhanController : ControllerBase
{
    private readonly ThongTinCaNhanService _service;
    public ThongTinCaNhanController(ThongTinCaNhanService service) => _service = service;

    // GET: api/ThongTinCaNhan/{maThanhVien}
    [HttpGet("{maThanhVien}")]
    public async Task<IActionResult> GetThongTin(int maThanhVien)
    {
        var result = await _service.GetThongTin(maThanhVien);
        return result != null ? Ok(result) : NotFound("Không tìm thấy thành viên");
    }

    // PUT: api/ThongTinCaNhan/{maThanhVien}
    [HttpPut("{maThanhVien}")]
    public async Task<IActionResult> CapNhatThongTin(int maThanhVien, [FromBody] CapNhatThongTinRequestDto dto)
    {
        var result = await _service.CapNhatThongTin(maThanhVien, dto);
        return result ? Ok(new { Message = "Cập nhật thành công" }) : BadRequest("Không thể cập nhật");
    }

    // POST: api/ThongTinCaNhan/doimatkhau/{maThanhVien}
    [HttpPost("doimatkhau/{maThanhVien}")]
    public async Task<IActionResult> DoiMatKhau(int maThanhVien, [FromBody] DoiMatKhauRequestDto dto)
    {
        var result = await _service.DoiMatKhau(maThanhVien, dto);
        return result ? Ok(new { Message = "Đổi mật khẩu thành công" }) : BadRequest("Mật khẩu cũ không đúng hoặc xác nhận không khớp");
    }
}
