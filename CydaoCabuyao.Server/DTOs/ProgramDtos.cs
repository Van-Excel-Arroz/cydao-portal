using CydaoCabuyao.Server.Models;

namespace CydaoCabuyao.Server.DTOs;

public class CreateProgramDto
{
  public string Title { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public ProgramCategory Category { get; set; }
  public DateTime ApplicationDeadline { get; set; }
  public bool IsOpen { get; set; } = true;
}
