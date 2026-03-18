using CydaoCabuyao.Server.DTOs;
using CydaoCabuyao.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CydaoCabuyao.Server.Services;

public interface IEventRegistrationService
{
  Task<List<EventRegistrationEventDto>> GetByEventAsync(int eventId);
  Task<List<EventRegistrationUserDto>> GetByUserAsync(int userId);
  Task<(bool Success, string? Error, int? RegistrationId)> CreateAsync(CreateEventRegistrationDto dto);
  Task<bool> DeleteAsync(int id);
}

public class EventRegistrationService : IEventRegistrationService
{
  private readonly AppDbContext _db;

  public EventRegistrationService(AppDbContext db)
  {
    _db = db;
  }

  public async Task<List<EventRegistrationEventDto>> GetByEventAsync(int eventId)
  {
    return await _db.EventRegistrations
        .Where(r => r.EventId == eventId)
        .Select(r => new EventRegistrationEventDto
        {
          Id = r.Id,
          EventId = r.EventId,
          RegistrantName = r.User.FirstName + " " + r.User.LastName,
          Barangay = (int)r.User.Barangay,
          RegisteredAt = r.CreatedAt
        })
        .OrderByDescending(r => r.RegisteredAt)
        .ToListAsync();
  }

  public async Task<List<EventRegistrationUserDto>> GetByUserAsync(int userId)
  {
    return await _db.EventRegistrations
        .Where(r => r.UserId == userId)
        .Select(r => new EventRegistrationUserDto
        {
          Id = r.Id,
          EventId = r.EventId,
          EventTitle = r.Event.Title,
          EventDescription = r.Event.Description,
          StartDate = r.Event.StartDate,
          EndDate = r.Event.EndDate,
          Venue = r.Event.Venue,
          AvailableSlots = r.Event.AvailableSlots,
          IsOpen = r.Event.IsOpen,
          RegisteredAt = r.CreatedAt
        })
        .OrderBy(r => r.StartDate)
        .ToListAsync();
  }

  public async Task<(bool Success, string? Error, int? RegistrationId)> CreateAsync(CreateEventRegistrationDto dto)
  {
    var cydaoEvent = await _db.Events.FindAsync(dto.EventId);

    if (cydaoEvent is null)
      return (false, "Event not found.", null);

    if (!cydaoEvent.IsOpen)
      return (false, "Event is closed.", null);

    var alreadyRegistered = await _db.EventRegistrations
        .AnyAsync(r => r.UserId == dto.UserId && r.EventId == dto.EventId);

    if (alreadyRegistered)
      return (false, "User is already registered for this event.", null);

    var registration = new EventRegistration
    {
      UserId = dto.UserId,
      EventId = dto.EventId,
      CreatedAt = DateTime.UtcNow
    };

    _db.EventRegistrations.Add(registration);
    await _db.SaveChangesAsync();

    return (true, null, registration.Id);
  }

  public async Task<bool> DeleteAsync(int id)
  {
    var registration = await _db.EventRegistrations.FindAsync(id);

    if (registration is null)
      return false;

    _db.EventRegistrations.Remove(registration);
    await _db.SaveChangesAsync();

    return true;
  }
}
