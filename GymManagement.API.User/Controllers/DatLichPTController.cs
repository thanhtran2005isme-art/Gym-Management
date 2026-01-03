using GymManagement.API.User.DTOs;
using GymManagement.API.User.Services;
using Microsoft.AspNetCore.Mvc;

namespace GymManagement.API.User.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DatLichPTController : ControllerBase
{
    private readonly DatLichPTService _service;
    public DatLichPTController(DatLichPTService service) => _service = service;

    // GET: api/DatLichPT/hopdong/{maThanhVien}
    [HttpGet("hopdong/{maThanhVien}")]
    public async Task<IActionResult> GetHopDongPT(int maThanhVien)
    {
        var result = await _service.GetHopDongPTByThanhVien(maThanhVien);
        return Ok(result);
    }

    // GET: api/DatLichPT/lich/{maHopDongPT}
    [HttpGet("lich/{maHopDongPT}")]
    public async Task<IActionResult> GetLichDat(int maHopDongPT)
    {
        var result = await _service.GetLichDatByHopDong(maHopDongPT);
        return Ok(result);
    }

    // POST: api/DatLichPT
    [HttpPost]
    public async Task<IActionResult> DatLich([FromBody] DatLichPTRequestDto dto)
    {
        var id = await _service.DatLich(dto);
        return Ok(new { MaBuoiTapPT = id, Message = "Đặt lịch thành công" });
    }

    // PUT: api/DatLichPT/{maBuoiTapPT}
    [HttpPut("{maBuoiTapPT}")]
    public async Task<IActionResult> CapNhatLich(int maBuoiTapPT, [FromBody] CapNhatLichPTDto dto)
    {
        var result = await _service.CapNhatLich(maBuoiTapPT, dto);
        return result ? Ok(new { Message = "Cập nhật thành công" }) : BadRequest("Không thể cập nhật");
    }

    // DELETE: api/DatLichPT/{maBuoiTapPT}
    [HttpDelete("{maBuoiTapPT}")]
    public async Task<IActionResult> HuyLich(int maBuoiTapPT)
    {
        var result = await _service.HuyLich(maBuoiTapPT);
        return result ? Ok(new { Message = "Hủy lịch thành công" }) : BadRequest("Không thể hủy");
    }
}
