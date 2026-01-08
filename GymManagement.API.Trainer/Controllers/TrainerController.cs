using Microsoft.AspNetCore.Mvc;
using GymManagement.API.Trainer.DTOs;
using GymManagement.API.Trainer.Services;

namespace GymManagement.API.Trainer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrainerController : ControllerBase
    {
        private readonly ITrainerService _trainerService;
        private const int CurrentTrainerId = 1; // TODO: Lấy từ JWT token

        public TrainerController(ITrainerService trainerService)
        {
            _trainerService = trainerService;
        }

        #region Quản lý Học viên

        /// <summary>
        /// Danh sách học viên đang tập với PT
        /// </summary>
        [HttpGet("my-members")]
        public async Task<ActionResult<List<HocVienDto>>> GetMyMembers()
        {
            var members = await _trainerService.GetMyMembersAsync(CurrentTrainerId);
            return Ok(members);
        }

        /// <summary>
        /// Chi tiết học viên
        /// </summary>
        [HttpGet("my-members/{id}")]
        public async Task<ActionResult<HocVienChiTietDto>> GetMemberById(int id)
        {
            var member = await _trainerService.GetMemberByIdAsync(CurrentTrainerId, id);
            if (member == null)
                return NotFound(new { message = "Không tìm thấy học viên" });
            return Ok(member);
        }

        /// <summary>
        /// Xem hợp đồng của học viên
        /// </summary>
        [HttpGet("my-members/{id}/contracts")]
        public async Task<ActionResult<List<HopDongPTDto>>> GetMemberContracts(int id)
        {
            var contracts = await _trainerService.GetMemberContractsAsync(CurrentTrainerId, id);
            return Ok(contracts);
        }

        /// <summary>
        /// Xem lịch sử buổi tập của học viên
        /// </summary>
        [HttpGet("my-members/{id}/sessions")]
        public async Task<ActionResult<List<BuoiTapPTDto>>> GetMemberSessions(int id)
        {
            var sessions = await _trainerService.GetMemberSessionsAsync(CurrentTrainerId, id);
            return Ok(sessions);
        }

        /// <summary>
        /// Học viên đang có hợp đồng active
        /// </summary>
        [HttpGet("my-members/active")]
        public async Task<ActionResult<List<HocVienDto>>> GetActiveMembers()
        {
            var members = await _trainerService.GetActiveMembersAsync(CurrentTrainerId);
            return Ok(members);
        }

        #endregion

        #region Thông tin cá nhân PT

        /// <summary>
        /// Xem thông tin cá nhân PT
        /// </summary>
        [HttpGet("profile")]
        public async Task<ActionResult<TrainerProfileDto>> GetProfile()
        {
            var profile = await _trainerService.GetProfileAsync(CurrentTrainerId);
            if (profile == null)
                return NotFound(new { message = "Không tìm thấy thông tin PT" });
            return Ok(profile);
        }

        /// <summary>
        /// Cập nhật thông tin PT
        /// </summary>
        [HttpPut("profile")]
        public async Task<ActionResult<TrainerProfileDto>> UpdateProfile([FromBody] UpdateTrainerProfileDto dto)
        {
            var profile = await _trainerService.UpdateProfileAsync(CurrentTrainerId, dto);
            if (profile == null)
                return NotFound(new { message = "Không tìm thấy thông tin PT" });
            return Ok(profile);
        }

        /// <summary>
        /// Xem chuyên môn
        /// </summary>
        [HttpGet("specialization")]
        public async Task<ActionResult<ChuyenMonDto>> GetSpecialization()
        {
            var specialization = await _trainerService.GetSpecializationAsync(CurrentTrainerId);
            if (specialization == null)
                return NotFound(new { message = "Không tìm thấy thông tin chuyên môn" });
            return Ok(specialization);
        }

        #endregion

        #region Thống kê & Báo cáo

        /// <summary>
        /// Thống kê tổng quan
        /// </summary>
        [HttpGet("statistics")]
        public async Task<ActionResult<ThongKeTongQuanDto>> GetStatistics()
        {
            var stats = await _trainerService.GetStatisticsAsync(CurrentTrainerId);
            return Ok(stats);
        }

        /// <summary>
        /// Doanh thu/hoa hồng
        /// </summary>
        [HttpGet("revenue")]
        public async Task<ActionResult<DoanhThuDto>> GetRevenue([FromQuery] int month, [FromQuery] int year)
        {
            var revenue = await _trainerService.GetRevenueAsync(CurrentTrainerId, month, year);
            return Ok(revenue);
        }

        /// <summary>
        /// Tổng hợp buổi tập
        /// </summary>
        [HttpGet("sessions-summary")]
        public async Task<ActionResult<TongHopBuoiTapDto>> GetSessionsSummary([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var summary = await _trainerService.GetSessionsSummaryAsync(CurrentTrainerId, from, to);
            return Ok(summary);
        }

        /// <summary>
        /// Tỷ lệ tham gia của học viên
        /// </summary>
        [HttpGet("attendance-rate")]
        public async Task<ActionResult<TyLeThamGiaDto>> GetAttendanceRate()
        {
            var rate = await _trainerService.GetAttendanceRateAsync(CurrentTrainerId);
            return Ok(rate);
        }

        #endregion
    }
}
