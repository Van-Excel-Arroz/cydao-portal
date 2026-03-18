using CydaoCabuyao.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CydaoCabuyao.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProgramsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProgramsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CydaoProgram>>> GetAll()
    {
        var programs = await _db.Programs
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return Ok(programs);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CydaoProgram>> GetById(int id)
    {
        var program = await _db.Programs.FindAsync(id);

        if (program is null)
            return NotFound();

        return Ok(program);
    }

    [HttpPost]
    public async Task<ActionResult<CydaoProgram>> Create([FromBody] CydaoProgram program)
    {
        _db.Programs.Add(program);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = program.Id }, program);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CydaoProgram updated)
    {
        var program = await _db.Programs.FindAsync(id);

        if (program is null)
            return NotFound();

        program.Title = updated.Title;
        program.Description = updated.Description;
        program.Category = updated.Category;
        program.ApplicationDeadline = updated.ApplicationDeadline;
        program.IsOpen = updated.IsOpen;

        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var program = await _db.Programs.FindAsync(id);

        if (program is null)
            return NotFound();

        _db.Programs.Remove(program);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
