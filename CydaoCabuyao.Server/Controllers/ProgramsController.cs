using CydaoCabuyao.Server.DTOs;
using CydaoCabuyao.Server.Models;
using CydaoCabuyao.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CydaoCabuyao.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProgramsController(IProgramService programService) : ControllerBase
{
  [HttpGet]
  public async Task<ActionResult<IEnumerable<CydaoProgram>>> GetAll()
  {
    var programs = await programService.GetAllAsync();
    return Ok(programs);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<CydaoProgram>> GetById(int id)
  {
    var program = await programService.GetByIdAsync(id);

    if (program is null)
      return NotFound(new { message = "Program not found." });

    return Ok(program);
  }

  [Authorize(Roles = "Staff")]
  [HttpPost]
  public async Task<ActionResult<CydaoProgram>> Create([FromBody] CreateProgramDto dto)
  {
    var program = await programService.CreateAsync(dto);
    return CreatedAtAction(nameof(GetById), new { id = program.Id }, program);
  }

  [Authorize(Roles = "Staff")]
  [HttpPut("{id}")]
  public async Task<IActionResult> Update(int id, [FromBody] CreateProgramDto dto)
  {
    var found = await programService.UpdateAsync(id, dto);

    if (!found)
      return NotFound(new { message = "Program not found." });

    return NoContent();
  }

  [Authorize(Roles = "Staff")]
  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(int id)
  {
    var found = await programService.DeleteAsync(id);

    if (!found)
      return NotFound(new { message = "Program not found." });

    return NoContent();
  }
}
