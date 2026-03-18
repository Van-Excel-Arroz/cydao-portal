namespace CydaoCabuyao.Server.DTOs;

public class CreateEventRegistrationDto
{
  public int UserId { get; set; }
  public int EventId { get; set; }
}

public class EventRegistrationEventDto
{
  public int Id { get; set; }
  public int EventId { get; set; }
  public string RegistrantName { get; set; } = string.Empty;
  public int Barangay { get; set; }
  public DateTime RegisteredAt { get; set; }
}

public class EventRegistrationUserDto
{
  public int Id { get; set; }
  public int EventId { get; set; }
  public string EventTitle { get; set; } = string.Empty;
  public string EventDescription { get; set; } = string.Empty;
  public DateTime StartDate { get; set; }
  public DateTime EndDate { get; set; }
  public string Venue { get; set; } = string.Empty;
  public int AvailableSlots { get; set; }
  public bool IsOpen { get; set; }
  public DateTime RegisteredAt { get; set; }
}
