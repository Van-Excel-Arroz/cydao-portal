using CydaoCabuyao.Server.Models;

public class Application
{
  public int Id { get; set; }
  public int UserId { get; set; }
  public User User { get; set; } = null!;
  public int ProgramId { get; set; }
  public CydaoProgram Program { get; set; } = null!;
  public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
