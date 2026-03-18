using System.Security.Claims;
using CydaoCabuyao.Server.DTOs;
using CydaoCabuyao.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CydaoCabuyao.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EventRegistrationsController(IEventRegistrationService registrationService) : ControllerBase
{
  [Authorize(Roles = "Staff")]
  [HttpGet("event/{eventId}")]
  public async Task<ActionResult<IEnumerable<EventRegistrationEventDto>>> GetByEvent(int eventId)
  {
    var registrations = await registrationService.GetByEventAsync(eventId);
    return Ok(registrations);
  }

  [HttpGet("user")]
  public async Task<ActionResult<IEnumerable<EventRegistrationUserDto>>> GetByUser()
  {
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var registrations = await registrationService.GetByUserAsync(userId);
    return Ok(registrations);
  }

  [HttpPost]
  public async Task<IActionResult> Create([FromBody] CreateEventRegistrationDto dto)
  {
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var (success, error, registrationId) = await registrationService.CreateAsync(dto, userId);

    if (!success)
      return BadRequest(new { message = error });

    return Ok(new { message = "User successfully registered for the event.", id = registrationId });
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(int id)
  {
    var found = await registrationService.DeleteAsync(id);

    if (!found)
      return NotFound(new { message = "Registration not found." });

    return NoContent();
  }
}
