public class EventRegistration
{
  public int Id { get; set; }
  public int UserId { get; set; }
  public User User { get; set; } = null!;
  public int EventId { get; set; }
  public CydaoEvent Event { get; set; } = null!;
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}