using CydaoCabuyao.Server.DTOs;
using CydaoCabuyao.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace CydaoCabuyao.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController(IApplicationService applicationService) : ControllerBase
{
  [HttpGet]
  public async Task<IActionResult> GetAll()
  {
    var applications = await applicationService.GetAllAsync();
    return Ok(applications);
  }

  [HttpGet("user/{userId}")]
  public async Task<IActionResult> GetByUser(int userId)
  {
    var applications = await applicationService.GetByUserAsync(userId);

    if (applications is null)
      return NotFound(new { message = "User not found." });

    return Ok(applications);
  }

  [HttpPost]
  public async Task<IActionResult> Create([FromBody] CreateApplicationDto dto)
  {
    var (success, error, statusCode, application) = await applicationService.CreateAsync(dto);

    if (!success)
    {
      return statusCode == 409
          ? Conflict(new { message = error })
          : BadRequest(new { message = error });
    }

    return CreatedAtAction(nameof(GetAll), new { id = application!.Id }, application);
  }

  [HttpPut("{id}/status")]
  public async Task<IActionResult> UpdateStatus(int id, [FromBody] ApplicationStatusUpdateDto dto)
  {
    var found = await applicationService.UpdateStatusAsync(id, dto);

    if (!found)
      return NotFound(new { message = "Application not found." });

    return NoContent();
  }
}
