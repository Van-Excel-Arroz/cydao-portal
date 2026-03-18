using CydaoCabuyao.Server.Models;

namespace CydaoCabuyao.Server.DTOs;

public class CreateApplicationDto
{
  public int ProgramId { get; set; }
}

public class ApplicationStatusUpdateDto
{
  public ApplicationStatus Status { get; set; }
}
