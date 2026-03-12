using CydaoCabuyao.Server.Models;

public class User
{
  public int Id { get; set; }
  public string FirstName { get; set; } = string.Empty;
  public string LastName { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public string Password { get; set; } = string.Empty;
  public string MobileNumber { get; set; } = string.Empty;
  public DateTime DateOfBirth { get; set; }
  public Barangay Barangay { get; set; }
  public UserRole Role { get; set; } = UserRole.Youth;
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}