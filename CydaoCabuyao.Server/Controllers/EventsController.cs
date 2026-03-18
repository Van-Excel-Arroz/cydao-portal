using CydaoCabuyao.Server.DTOs;
using CydaoCabuyao.Server.Models;
using CydaoCabuyao.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CydaoCabuyao.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController(IEventService eventService) : ControllerBase
{
  [HttpGet]
  public async Task<ActionResult<IEnumerable<CydaoEvent>>> GetAll()
  {
    var events = await eventService.GetAllAsync();
    return Ok(events);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<CydaoEvent>> GetById(int id)
  {
    var cydaoEvent = await eventService.GetByIdAsync(id);

    if (cydaoEvent is null)
      return NotFound(new { message = "Event not found." });

    return Ok(cydaoEvent);
  }

  [Authorize(Roles = "Staff")]
  [HttpPost]
  public async Task<ActionResult<CydaoEvent>> Create([FromBody] CreateEventDto dto)
  {
    var cydaoEvent = await eventService.CreateAsync(dto);
    return CreatedAtAction(nameof(GetById), new { id = cydaoEvent.Id }, cydaoEvent);
  }

  [Authorize(Roles = "Staff")]
  [HttpPut("{id}")]
  public async Task<IActionResult> Update(int id, [FromBody] CreateEventDto dto)
  {
    var found = await eventService.UpdateAsync(id, dto);

    if (!found)
      return NotFound(new { message = "Event not found." });

    return NoContent();
  }

  [Authorize(Roles = "Staff")]
  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(int id)
  {
    var found = await eventService.DeleteAsync(id);

    if (!found)
      return NotFound(new { message = "Event not found." });

    return NoContent();
  }
}
