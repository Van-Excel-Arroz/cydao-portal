public class CydaoEvent
{
  public int Id { get; set; }
  public string Title { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public DateTime StartDate { get; set; }
  public DateTime EndDate { get; set; }
  public string Venue { get; set; } = string.Empty;
  public int AvailableSlots { get; set; }
  public bool IsOpen { get; set; } = true;
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}