using GymManagement.API.User.DTOs;
using GymManagement.API.User.Services;
using Microsoft.AspNetCore.Mvc;

namespace GymManagement.API.User.Controllers;

[ApiController]
[Route("api/user")]
public class UserController : ControllerBase
{
    private readonly ProfileService _profileService;
    private readonly PackageService _packageService;
    private readonly PTSessionService _ptService;
    private readonly CheckinService _checkinService;
    private readonly InvoiceService _invoiceService;
    private readonly NotificationService _notificationService;

    public UserController(ProfileService profileService, PackageService packageService,
        PTSessionService ptService, CheckinService checkinService,
        InvoiceService invoiceService, NotificationService notificationService)
    {
        _profileService = profileService;
        _packageService = packageService;
        _ptService = ptService;
        _checkinService = checkinService;
        _invoiceService = invoiceService;
        _notificationService = notificationService;
    }

    // ===== THÔNG TIN CÁ NHÂN =====
    [HttpGet("thong-tin")]
    public async Task<IActionResult> GetProfile([FromHeader(Name = "X-User-Id")] int maThanhVien)
    {
        var result = await _profileService.GetProfile(maThanhVien);
        return result != null ? Ok(result) : NotFound();
    }

    [HttpPut("thong-tin")]
    public async Task<IActionResult> UpdateProfile([FromHeader(Name = "X-User-Id")] int maThanhVien, [FromBody] UpdateProfileDto dto)
    {
        var result = await _profileService.UpdateProfile(maThanhVien, dto);
        return result ? Ok(new { Message = "Cập nhật thành công" }) : BadRequest();
    }

    [HttpPut("doi-mat-khau")]
    public async Task<IActionResult> ChangePassword([FromHeader(Name = "X-User-Id")] int maThanhVien, [FromBody] ChangePasswordDto dto)
    {
        var result = await _profileService.ChangePassword(maThanhVien, dto);
        return result ? Ok(new { Message = "Đổi mật khẩu thành công" }) : BadRequest("Mật khẩu không đúng");
    }

    // ===== GÓI TẬP CỦA TÔI =====
    [HttpGet("goi-tap-cua-toi")]
    public async Task<IActionResult> GetMyPackages([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _packageService.GetMyPackages(maThanhVien));

    [HttpGet("goi-tap-cua-toi/dang-hoat-dong")]
    public async Task<IActionResult> GetActivePackages([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _packageService.GetActivePackages(maThanhVien));

    [HttpGet("goi-tap-cua-toi/{id}")]
    public async Task<IActionResult> GetPackageDetail([FromHeader(Name = "X-User-Id")] int maThanhVien, int id)
    {
        var result = await _packageService.GetPackageDetail(maThanhVien, id);
        return result != null ? Ok(result) : NotFound();
    }

    [HttpGet("goi-tap-cua-toi/lich-su")]
    public async Task<IActionResult> GetPackageHistory([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _packageService.GetPackageHistory(maThanhVien));

    // ===== LỊCH TẬP PT =====
    [HttpGet("lich-tap-pt")]
    public async Task<IActionResult> GetMyPTSessions([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _ptService.GetMySessions(maThanhVien));

    [HttpGet("lich-tap-pt/sap-toi")]
    public async Task<IActionResult> GetUpcomingPTSessions([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _ptService.GetUpcomingSessions(maThanhVien));

    [HttpGet("lich-tap-pt/lich-su")]
    public async Task<IActionResult> GetPTSessionHistory([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _ptService.GetSessionHistory(maThanhVien));

    // ===== BUỔI TẬP & ĐIỂM DANH =====
    [HttpGet("buoi-tap")]
    public async Task<IActionResult> GetMySessions([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _checkinService.GetMySessions(maThanhVien));

    [HttpGet("buoi-tap/thong-ke")]
    public async Task<IActionResult> GetSessionStats([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _checkinService.GetSessionStats(maThanhVien));

    [HttpGet("diem-danh")]
    public async Task<IActionResult> GetMyCheckins([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _checkinService.GetMyCheckins(maThanhVien));

    [HttpGet("diem-danh/hom-nay")]
    public async Task<IActionResult> GetTodayCheckin([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _checkinService.GetTodayCheckin(maThanhVien));

    [HttpGet("diem-danh/thong-ke")]
    public async Task<IActionResult> GetCheckinStats([FromHeader(Name = "X-User-Id")] int maThanhVien, [FromQuery] int thang, [FromQuery] int? nam)
        => Ok(await _checkinService.GetCheckinStats(maThanhVien, thang, nam ?? DateTime.Now.Year));

    // ===== HÓA ĐƠN =====
    [HttpGet("hoa-don")]
    public async Task<IActionResult> GetMyInvoices([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _invoiceService.GetMyInvoices(maThanhVien));

    [HttpGet("hoa-don/{id}")]
    public async Task<IActionResult> GetInvoiceDetail([FromHeader(Name = "X-User-Id")] int maThanhVien, int id)
    {
        var result = await _invoiceService.GetInvoiceDetail(maThanhVien, id);
        return result != null ? Ok(result) : NotFound();
    }

    [HttpGet("hoa-don/{id}/thanh-toan")]
    public async Task<IActionResult> GetPaymentHistory([FromHeader(Name = "X-User-Id")] int maThanhVien, int id)
        => Ok(await _invoiceService.GetPaymentHistory(maThanhVien, id));

    // ===== THÔNG BÁO =====
    [HttpGet("thong-bao")]
    public async Task<IActionResult> GetNotifications([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _notificationService.GetNotifications(maThanhVien));

    [HttpGet("thong-bao/chua-doc")]
    public async Task<IActionResult> GetUnreadNotifications([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _notificationService.GetUnreadNotifications(maThanhVien));

    [HttpPut("thong-bao/{id}/da-doc")]
    public async Task<IActionResult> MarkNotificationAsRead([FromHeader(Name = "X-User-Id")] int maThanhVien, int id)
    {
        var result = await _notificationService.MarkAsRead(maThanhVien, id);
        return result ? Ok(new { Message = "Đã đánh dấu đã đọc" }) : BadRequest();
    }
}
