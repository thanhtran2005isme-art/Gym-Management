using Microsoft.AspNetCore.Mvc;
using GymManagement.API.Trainer.DTOs;
using GymManagement.API.Trainer.Services;

namespace GymManagement.API.Trainer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HopDongPTController : ControllerBase
    {
        private readonly IHopDongPTService _hopDongService;
        private const int CurrentTrainerId = 1; // TODO: Lấy từ JWT token

        public HopDongPTController(IHopDongPTService hopDongService)
        {
            _hopDongService = hopDongService;
        }

        /// <summary>
        /// Xem danh sách hợp đồng PT của mình
        /// </summary>
        [HttpGet("my-contracts")]
        public async Task<ActionResult<List<HopDongPTDto>>> GetMyContracts()
        {
            var contracts = await _hopDongService.GetMyContractsAsync(CurrentTrainerId);
            return Ok(contracts);
        }

        /// <summary>
        /// Xem chi tiết hợp đồng PT
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<HopDongPTDto>> GetById(int id)
        {
            var contract = await _hopDongService.GetByIdAsync(id);
            if (contract == null)
                return NotFound(new { message = "Không tìm thấy hợp đồng" });
            return Ok(contract);
        }

        /// <summary>
        /// Xem hợp đồng đang hoạt động
        /// </summary>
        [HttpGet("active")]
        public async Task<ActionResult<List<HopDongPTDto>>> GetActiveContracts()
        {
            var contracts = await _hopDongService.GetActiveContractsAsync(CurrentTrainerId);
            return Ok(contracts);
        }

        /// <summary>
        /// Xem hợp đồng của học viên cụ thể
        /// </summary>
        [HttpGet("by-member/{maThanhVien}")]
        public async Task<ActionResult<List<HopDongPTDto>>> GetByMember(int maThanhVien)
        {
            var contracts = await _hopDongService.GetByMemberAsync(maThanhVien);
            return Ok(contracts);
        }

        /// <summary>
        /// Xem hợp đồng sắp hết hạn
        /// </summary>
        [HttpGet("expiring")]
        public async Task<ActionResult<List<HopDongPTDto>>> GetExpiringContracts([FromQuery] int days = 30)
        {
            var contracts = await _hopDongService.GetExpiringContractsAsync(CurrentTrainerId, days);
            return Ok(contracts);
        }
    }
}
