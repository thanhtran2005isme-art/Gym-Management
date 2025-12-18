using GymManagement.API.Admin.DTOs;
using GymManagement.API.Admin.Services;
using Microsoft.AspNetCore.Mvc;

namespace GymManagement.API.Admin.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    public class BuoiTapController : ControllerBase
    {
        private readonly IBuoiTapService _service;

        public BuoiTapController(IBuoiTapService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _service.GetAllAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách buổi tập", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var result = await _service.GetByIdAsync(id);
                if (result == null)
                    return NotFound(new { message = "Không tìm thấy buổi tập" });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thông tin buổi tập", error = ex.Message });
            }
        }

        [HttpGet("thanh-vien/{maThanhVien}")]
        public async Task<IActionResult> GetByThanhVien(int maThanhVien)
        {
            try
            {
                var result = await _service.GetByThanhVienAsync(maThanhVien);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách buổi tập của thành viên", error = ex.Message });
            }
        }

        [HttpGet("date-range")]
        public async Task<IActionResult> GetByDateRange([FromQuery] DateTime tuNgay, [FromQuery] DateTime denNgay)
        {
            try
            {
                var result = await _service.GetByDateRangeAsync(tuNgay, denNgay);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách buổi tập theo khoảng thời gian", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBuoiTapDto dto)
        {
            try
            {
                var id = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id }, new { maBuoiTap = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo buổi tập", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateBuoiTapDto dto)
        {
            try
            {
                var success = await _service.UpdateAsync(id, dto);
                if (!success)
                    return NotFound(new { message = "Không tìm thấy buổi tập" });

                return Ok(new { message = "Cập nhật buổi tập thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật buổi tập", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var success = await _service.DeleteAsync(id);
                if (!success)
                    return NotFound(new { message = "Không tìm thấy buổi tập" });

                return Ok(new { message = "Xóa buổi tập thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa buổi tập", error = ex.Message });
            }
        }
    }
}
