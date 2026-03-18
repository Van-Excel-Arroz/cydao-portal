using CydaoCabuyao.Server.DTOs;
using CydaoCabuyao.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace CydaoCabuyao.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventRegistrationsController(IEventRegistrationService registrationService) : ControllerBase
{
  [HttpGet("event/{eventId}")]
  public async Task<ActionResult<IEnumerable<EventRegistrationEventDto>>> GetByEvent(int eventId)
  {
    var registrations = await registrationService.GetByEventAsync(eventId);
    return Ok(registrations);
  }

  [HttpGet("user/{userId}")]
  public async Task<ActionResult<IEnumerable<EventRegistrationUserDto>>> GetByUser(int userId)
  {
    var registrations = await registrationService.GetByUserAsync(userId);
    return Ok(registrations);
  }

  [HttpPost]
  public async Task<IActionResult> Create([FromBody] CreateEventRegistrationDto dto)
  {
    var (success, error, registrationId) = await registrationService.CreateAsync(dto);

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
