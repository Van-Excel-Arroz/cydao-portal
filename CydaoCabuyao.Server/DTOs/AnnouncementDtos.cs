using CydaoCabuyao.Server.Models;

namespace CydaoCabuyao.Server.DTOs;

public class CreateAnnouncementDto
{
  public string Title { get; set; } = string.Empty;
  public string Body { get; set; } = string.Empty;
  public AnnouncementCategory Category { get; set; } = AnnouncementCategory.New;
}
