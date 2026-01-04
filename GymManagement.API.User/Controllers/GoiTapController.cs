using GymManagement.API.User.Services;
using Microsoft.AspNetCore.Mvc;

namespace GymManagement.API.User.Controllers;

[ApiController]
[Route("api/goi-tap")]
public class GoiTapController : ControllerBase
{
    private readonly PackageService _service;
    public GoiTapController(PackageService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllGoiTap());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetGoiTapById(id);
        return result != null ? Ok(result) : NotFound();
    }
}
