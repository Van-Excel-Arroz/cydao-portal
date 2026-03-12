using CydaoCabuyao.Server.Models;

public class CydaoProgram
{
  public int Id { get; set; }
  public string Title { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public ProgramCategory Category { get; set; }
  public DateTime ApplicationDeadline { get; set; }
  public bool IsOpen { get; set; } = true;
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}