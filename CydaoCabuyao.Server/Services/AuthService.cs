using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CydaoCabuyao.Server.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace CydaoCabuyao.Server.Services;

public interface IAuthService
{
  Task<AuthResponseDto?> LoginAsync(LoginDto dto);
}

public class AuthService : IAuthService
{
  private readonly AppDbContext _db;
  private readonly IConfiguration _config;

  public AuthService(AppDbContext db, IConfiguration config)
  {
    _db = db;
    _config = config;
  }

  public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
  {
    var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

    if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
      return null;

    var claims = new[]
    {
      new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
      new Claim(ClaimTypes.Email, user.Email),
      new Claim(ClaimTypes.Role, user.Role.ToString())
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _config["Jwt:Issuer"],
        audience: _config["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddDays(7),
        signingCredentials: creds
    );

    return new AuthResponseDto
    {
      Token = new JwtSecurityTokenHandler().WriteToken(token),
      UserId = user.Id,
      FullName = $"{user.FirstName} {user.LastName}",
      Role = user.Role.ToString()
    };
  }
}
