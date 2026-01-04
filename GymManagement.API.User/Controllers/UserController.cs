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

    // ===== PROFILE =====
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile([FromHeader(Name = "X-User-Id")] int maThanhVien)
    {
        var result = await _profileService.GetProfile(maThanhVien);
        return result != null ? Ok(result) : NotFound();
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromHeader(Name = "X-User-Id")] int maThanhVien, [FromBody] UpdateProfileDto dto)
    {
        var result = await _profileService.UpdateProfile(maThanhVien, dto);
        return result ? Ok(new { Message = "Cập nhật thành công" }) : BadRequest();
    }

    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword([FromHeader(Name = "X-User-Id")] int maThanhVien, [FromBody] ChangePasswordDto dto)
    {
        var result = await _profileService.ChangePassword(maThanhVien, dto);
        return result ? Ok(new { Message = "Đổi mật khẩu thành công" }) : BadRequest("Mật khẩu không đúng");
    }

    // ===== MY PACKAGES =====
    [HttpGet("my-packages")]
    public async Task<IActionResult> GetMyPackages([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _packageService.GetMyPackages(maThanhVien));

    [HttpGet("my-packages/active")]
    public async Task<IActionResult> GetActivePackages([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _packageService.GetActivePackages(maThanhVien));

    [HttpGet("my-packages/{id}")]
    public async Task<IActionResult> GetPackageDetail([FromHeader(Name = "X-User-Id")] int maThanhVien, int id)
    {
        var result = await _packageService.GetPackageDetail(maThanhVien, id);
        return result != null ? Ok(result) : NotFound();
    }

    [HttpGet("my-packages/history")]
    public async Task<IActionResult> GetPackageHistory([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _packageService.GetPackageHistory(maThanhVien));

    // ===== PT SESSIONS =====
    [HttpGet("my-pt-sessions")]
    public async Task<IActionResult> GetMyPTSessions([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _ptService.GetMySessions(maThanhVien));

    [HttpGet("my-pt-sessions/upcoming")]
    public async Task<IActionResult> GetUpcomingPTSessions([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _ptService.GetUpcomingSessions(maThanhVien));

    [HttpGet("my-pt-sessions/history")]
    public async Task<IActionResult> GetPTSessionHistory([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _ptService.GetSessionHistory(maThanhVien));

    // ===== SESSIONS & CHECKINS =====
    [HttpGet("my-sessions")]
    public async Task<IActionResult> GetMySessions([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _checkinService.GetMySessions(maThanhVien));

    [HttpGet("my-sessions/stats")]
    public async Task<IActionResult> GetSessionStats([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _checkinService.GetSessionStats(maThanhVien));

    [HttpGet("my-checkins")]
    public async Task<IActionResult> GetMyCheckins([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _checkinService.GetMyCheckins(maThanhVien));

    [HttpGet("my-checkins/today")]
    public async Task<IActionResult> GetTodayCheckin([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _checkinService.GetTodayCheckin(maThanhVien));

    [HttpGet("my-checkins/stats")]
    public async Task<IActionResult> GetCheckinStats([FromHeader(Name = "X-User-Id")] int maThanhVien, [FromQuery] int month, [FromQuery] int? year)
        => Ok(await _checkinService.GetCheckinStats(maThanhVien, month, year ?? DateTime.Now.Year));

    // ===== INVOICES =====
    [HttpGet("my-invoices")]
    public async Task<IActionResult> GetMyInvoices([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _invoiceService.GetMyInvoices(maThanhVien));

    [HttpGet("my-invoices/{id}")]
    public async Task<IActionResult> GetInvoiceDetail([FromHeader(Name = "X-User-Id")] int maThanhVien, int id)
    {
        var result = await _invoiceService.GetInvoiceDetail(maThanhVien, id);
        return result != null ? Ok(result) : NotFound();
    }

    [HttpGet("my-invoices/{id}/payments")]
    public async Task<IActionResult> GetPaymentHistory([FromHeader(Name = "X-User-Id")] int maThanhVien, int id)
        => Ok(await _invoiceService.GetPaymentHistory(maThanhVien, id));

    // ===== NOTIFICATIONS =====
    [HttpGet("notifications")]
    public async Task<IActionResult> GetNotifications([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _notificationService.GetNotifications(maThanhVien));

    [HttpGet("notifications/unread")]
    public async Task<IActionResult> GetUnreadNotifications([FromHeader(Name = "X-User-Id")] int maThanhVien)
        => Ok(await _notificationService.GetUnreadNotifications(maThanhVien));

    [HttpPut("notifications/{id}/mark-read")]
    public async Task<IActionResult> MarkNotificationAsRead([FromHeader(Name = "X-User-Id")] int maThanhVien, int id)
    {
        var result = await _notificationService.MarkAsRead(maThanhVien, id);
        return result ? Ok(new { Message = "Đã đánh dấu đã đọc" }) : BadRequest();
    }
}
