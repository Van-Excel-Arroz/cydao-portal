using CydaoCabuyao.Server.Models;

namespace CydaoCabuyao.Server.DTOs;

public class CreateUserDto
{
  public string FirstName { get; set; } = string.Empty;
  public string LastName { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public string Password { get; set; } = string.Empty;
  public string MobileNumber { get; set; } = string.Empty;
  public DateTime DateOfBirth { get; set; }
  public Barangay Barangay { get; set; }
}

public class UpdateUserDto
{
  public string FirstName { get; set; } = string.Empty;
  public string LastName { get; set; } = string.Empty;
  public string MobileNumber { get; set; } = string.Empty;
  public DateTime DateOfBirth { get; set; }
  public Barangay Barangay { get; set; }
}

public class UserResponseDto
{
  public int Id { get; set; }
  public string FirstName { get; set; } = string.Empty;
  public string LastName { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public string MobileNumber { get; set; } = string.Empty;
  public DateTime DateOfBirth { get; set; }
  public Barangay Barangay { get; set; }
  public UserRole Role { get; set; }
  public DateTime CreatedAt { get; set; }
}
