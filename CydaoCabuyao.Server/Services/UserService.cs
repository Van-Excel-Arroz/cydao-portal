using CydaoCabuyao.Server.DTOs;
using CydaoCabuyao.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CydaoCabuyao.Server.Services;

public interface IUserService
{
  Task<List<UserResponseDto>> GetAllAsync();
  Task<UserResponseDto?> GetByIdAsync(int id);
  Task<(bool Success, string? Error, UserResponseDto? Data)> CreateAsync(CreateUserDto dto);
  Task<bool> UpdateAsync(int id, UpdateUserDto dto);
  Task<bool> DeleteAsync(int id);
}

public class UserService : IUserService
{
  private readonly AppDbContext _db;

  public UserService(AppDbContext db)
  {
    _db = db;
  }

  public async Task<List<UserResponseDto>> GetAllAsync()
  {
    return await _db.Users
        .OrderByDescending(u => u.CreatedAt)
        .Select(u => ToResponseDto(u))
        .ToListAsync();
  }

  public async Task<UserResponseDto?> GetByIdAsync(int id)
  {
    var user = await _db.Users.FindAsync(id);
    return user is null ? null : ToResponseDto(user);
  }

  public async Task<(bool Success, string? Error, UserResponseDto? Data)> CreateAsync(CreateUserDto dto)
  {
    var emailTaken = await _db.Users.AnyAsync(u => u.Email == dto.Email);
    if (emailTaken)
      return (false, "A user with this email already exists.", null);

    var user = new User
    {
      FirstName = dto.FirstName,
      LastName = dto.LastName,
      Email = dto.Email,
      Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
      MobileNumber = dto.MobileNumber,
      DateOfBirth = dto.DateOfBirth,
      Barangay = dto.Barangay,
      CreatedAt = DateTime.UtcNow
    };

    _db.Users.Add(user);
    await _db.SaveChangesAsync();

    return (true, null, ToResponseDto(user));
  }

  public async Task<bool> UpdateAsync(int id, UpdateUserDto dto)
  {
    var user = await _db.Users.FindAsync(id);
    if (user is null)
      return false;

    user.FirstName = dto.FirstName;
    user.LastName = dto.LastName;
    user.MobileNumber = dto.MobileNumber;
    user.DateOfBirth = dto.DateOfBirth;
    user.Barangay = dto.Barangay;

    await _db.SaveChangesAsync();

    return true;
  }

  public async Task<bool> DeleteAsync(int id)
  {
    var user = await _db.Users.FindAsync(id);
    if (user is null)
      return false;

    _db.Users.Remove(user);
    await _db.SaveChangesAsync();

    return true;
  }

  private static UserResponseDto ToResponseDto(User user) => new()
  {
    Id = user.Id,
    FirstName = user.FirstName,
    LastName = user.LastName,
    Email = user.Email,
    MobileNumber = user.MobileNumber,
    DateOfBirth = user.DateOfBirth,
    Barangay = user.Barangay,
    Role = user.Role,
    CreatedAt = user.CreatedAt
  };
}
