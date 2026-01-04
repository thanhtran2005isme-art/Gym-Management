using GymManagement.API.User.Services;
using Microsoft.AspNetCore.Mvc;

namespace GymManagement.API.User.Controllers;

[ApiController]
[Route("api/goi-pt")]
public class GoiPTController : ControllerBase
{
    private readonly PackageService _service;
    public GoiPTController(PackageService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllGoiPT());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetGoiPTById(id);
        return result != null ? Ok(result) : NotFound();
    }
}
