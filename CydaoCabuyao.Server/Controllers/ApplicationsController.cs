using CydaoCabuyao.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CydaoCabuyao.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ApplicationsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Application>>> GetAll()
    {
        var applications = await _db.Applications
            .Include(a => a.User)
            .Include(a => a.Program)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        return Ok(applications);
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<Application>>> GetByUser(int userId)
    {
        var userExists = await _db.Users.AnyAsync(u => u.Id == userId);

        if (!userExists)
            return NotFound();

        var applications = await _db.Applications
            .Where(a => a.UserId == userId)
            .Include(a => a.Program)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        return Ok(applications);
    }

    [HttpPost]
    public async Task<ActionResult<Application>> Create(Application application)
    {
        var programExists = await _db.Programs.AnyAsync(p => p.Id == application.ProgramId);
        if (!programExists)
            return BadRequest("Program not found.");

        var userExists = await _db.Users.AnyAsync(u => u.Id == application.UserId);
        if (!userExists)
            return BadRequest("User not found.");

        var duplicate = await _db.Applications.AnyAsync(a =>
            a.UserId == application.UserId && a.ProgramId == application.ProgramId);
        if (duplicate)
            return Conflict("User has already applied to this program.");

        application.Status = ApplicationStatus.Pending;
        application.CreatedAt = DateTime.UtcNow;

        _db.Applications.Add(application);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = application.Id }, application);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] ApplicationStatusUpdate dto)
    {
        var application = await _db.Applications.FindAsync(id);

        if (application is null)
            return NotFound();

        application.Status = dto.Status;
        await _db.SaveChangesAsync();

        return NoContent();
    }
}

public record ApplicationStatusUpdate(ApplicationStatus Status);
