using CydaoCabuyao.Server.DTOs;
using CydaoCabuyao.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CydaoCabuyao.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IUserService userService) : ControllerBase
{
  [Authorize(Roles = "Staff")]
  [HttpGet]
  public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAll()
  {
    var users = await userService.GetAllAsync();
    return Ok(users);
  }

  [Authorize(Roles = "Staff")]
  [HttpGet("{id}")]
  public async Task<ActionResult<UserResponseDto>> GetById(int id)
  {
    var user = await userService.GetByIdAsync(id);

    if (user is null)
      return NotFound(new { message = "User not found." });

    return Ok(user);
  }

  [HttpPost]
  public async Task<ActionResult<UserResponseDto>> Create([FromBody] CreateUserDto dto)
  {
    var (success, error, data) = await userService.CreateAsync(dto);

    if (!success)
      return Conflict(new { message = error });

    return CreatedAtAction(nameof(GetById), new { id = data!.Id }, data);
  }

  [Authorize]
  [HttpPut("{id}")]
  public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
  {
    var found = await userService.UpdateAsync(id, dto);

    if (!found)
      return NotFound(new { message = "User not found." });

    return NoContent();
  }

  [Authorize(Roles = "Staff")]
  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(int id)
  {
    var found = await userService.DeleteAsync(id);

    if (!found)
      return NotFound(new { message = "User not found." });

    return NoContent();
  }
}
