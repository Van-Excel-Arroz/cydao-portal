using CydaoCabuyao.Server.DTOs;
using CydaoCabuyao.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CydaoCabuyao.Server.Services;

public interface IEventService
{
  Task<List<CydaoEvent>> GetAllAsync();
  Task<CydaoEvent?> GetByIdAsync(int id);
  Task<CydaoEvent> CreateAsync(CreateEventDto dto);
  Task<bool> UpdateAsync(int id, CreateEventDto dto);
  Task<bool> DeleteAsync(int id);
}

public class EventService : IEventService
{
  private readonly AppDbContext _db;

  public EventService(AppDbContext db)
  {
    _db = db;
  }

  public async Task<List<CydaoEvent>> GetAllAsync()
  {
    return await _db.Events
        .OrderByDescending(e => e.StartDate)
        .ToListAsync();
  }

  public async Task<CydaoEvent?> GetByIdAsync(int id)
  {
    return await _db.Events.FindAsync(id);
  }

  public async Task<CydaoEvent> CreateAsync(CreateEventDto dto)
  {
    var cydaoEvent = new CydaoEvent
    {
      Title = dto.Title,
      Description = dto.Description,
      StartDate = dto.StartDate,
      EndDate = dto.EndDate,
      Venue = dto.Venue,
      AvailableSlots = dto.AvailableSlots,
      IsOpen = dto.IsOpen,
      CreatedAt = DateTime.UtcNow
    };

    _db.Events.Add(cydaoEvent);
    await _db.SaveChangesAsync();

    return cydaoEvent;
  }

  public async Task<bool> UpdateAsync(int id, CreateEventDto dto)
  {
    var cydaoEvent = await _db.Events.FindAsync(id);

    if (cydaoEvent is null)
      return false;

    cydaoEvent.Title = dto.Title;
    cydaoEvent.Description = dto.Description;
    cydaoEvent.StartDate = dto.StartDate;
    cydaoEvent.EndDate = dto.EndDate;
    cydaoEvent.Venue = dto.Venue;
    cydaoEvent.AvailableSlots = dto.AvailableSlots;
    cydaoEvent.IsOpen = dto.IsOpen;

    await _db.SaveChangesAsync();

    return true;
  }

  public async Task<bool> DeleteAsync(int id)
  {
    var cydaoEvent = await _db.Events.FindAsync(id);

    if (cydaoEvent is null)
      return false;

    _db.Events.Remove(cydaoEvent);
    await _db.SaveChangesAsync();

    return true;
  }
}
