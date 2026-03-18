using CydaoCabuyao.Server.DTOs;
using CydaoCabuyao.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace CydaoCabuyao.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
  [HttpPost("login")]
  public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
  {
    var result = await authService.LoginAsync(dto);

    if (result is null)
      return Unauthorized(new { message = "Invalid email or password." });

    return Ok(result);
  }
}
