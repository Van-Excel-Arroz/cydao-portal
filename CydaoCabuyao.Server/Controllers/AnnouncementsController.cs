using CydaoCabuyao.Server.DTOs;
using CydaoCabuyao.Server.Models;
using CydaoCabuyao.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CydaoCabuyao.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnnouncementsController(IAnnouncementService announcementService) : ControllerBase
{
  [HttpGet]
  public async Task<ActionResult<IEnumerable<Announcement>>> GetAll()
  {
    var announcements = await announcementService.GetAllAsync();
    return Ok(announcements);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<Announcement>> GetById(int id)
  {
    var announcement = await announcementService.GetByIdAsync(id);

    if (announcement is null)
      return NotFound(new { message = "Announcement not found." });

    return Ok(announcement);
  }

  [Authorize(Roles = "Staff")]
  [HttpPost]
  public async Task<ActionResult<Announcement>> Create([FromBody] CreateAnnouncementDto dto)
  {
    var announcement = await announcementService.CreateAsync(dto);
    return CreatedAtAction(nameof(GetById), new { id = announcement.Id }, announcement);
  }

  [Authorize(Roles = "Staff")]
  [HttpPut("{id}")]
  public async Task<IActionResult> Update(int id, [FromBody] CreateAnnouncementDto dto)
  {
    var found = await announcementService.UpdateAsync(id, dto);

    if (!found)
      return NotFound(new { message = "Announcement not found." });

    return NoContent();
  }

  [Authorize(Roles = "Staff")]
  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(int id)
  {
    var found = await announcementService.DeleteAsync(id);

    if (!found)
      return NotFound(new { message = "Announcement not found." });

    return NoContent();
  }
}
