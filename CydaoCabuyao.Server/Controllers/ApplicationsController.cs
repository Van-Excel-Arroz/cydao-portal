using System.Security.Claims;
using CydaoCabuyao.Server.DTOs;
using CydaoCabuyao.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CydaoCabuyao.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationsController(IApplicationService applicationService) : ControllerBase
{
  [Authorize(Roles = "Staff")]
  [HttpGet]
  public async Task<IActionResult> GetAll()
  {
    var applications = await applicationService.GetAllAsync();
    return Ok(applications);
  }

  [HttpGet("user")]
  public async Task<IActionResult> GetByUser()
  {
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var applications = await applicationService.GetByUserAsync(userId);

    if (applications is null)
      return NotFound(new { message = "User not found." });

    return Ok(applications);
  }

  [HttpPost]
  public async Task<IActionResult> Create([FromBody] CreateApplicationDto dto)
  {
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var (success, error, statusCode, application) = await applicationService.CreateAsync(dto, userId);

    if (!success)
    {
      return statusCode == 409
          ? Conflict(new { message = error })
          : BadRequest(new { message = error });
    }

    return CreatedAtAction(nameof(GetAll), new { id = application!.Id }, application);
  }

  [Authorize(Roles = "Staff")]
  [HttpPut("{id}/status")]
  public async Task<IActionResult> UpdateStatus(int id, [FromBody] ApplicationStatusUpdateDto dto)
  {
    var found = await applicationService.UpdateStatusAsync(id, dto);

    if (!found)
      return NotFound(new { message = "Application not found." });

    return NoContent();
  }
}
