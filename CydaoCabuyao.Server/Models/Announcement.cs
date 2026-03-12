using CydaoCabuyao.Server.Models;

public class Announcement
{
  public int Id { get; set; }
  public string Title { get; set; } = string.Empty;
  public string Body { get; set; } = string.Empty;
  public AnnouncementCategory Category { get; set; } = AnnouncementCategory.New;
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}