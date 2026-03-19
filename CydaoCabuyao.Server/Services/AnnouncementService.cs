using CydaoCabuyao.Server.DTOs;
using CydaoCabuyao.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CydaoCabuyao.Server.Services;

public interface IAnnouncementService
{
  Task<List<Announcement>> GetAllAsync();
  Task<Announcement?> GetByIdAsync(int id);
  Task<Announcement> CreateAsync(CreateAnnouncementDto dto);
  Task<bool> UpdateAsync(int id, CreateAnnouncementDto dto);
  Task<bool> DeleteAsync(int id);
}

public class AnnouncementService(AppDbContext db) : IAnnouncementService
{
  public async Task<List<Announcement>> GetAllAsync()
  {
    return await db.Announcements
        .OrderByDescending(a => a.CreatedAt)
        .ToListAsync();
  }

  public async Task<Announcement?> GetByIdAsync(int id)
  {
    return await db.Announcements.FindAsync(id);
  }

  public async Task<Announcement> CreateAsync(CreateAnnouncementDto dto)
  {
    var announcement = new Announcement
    {
      Title = dto.Title,
      Body = dto.Body,
      Category = dto.Category,
      CreatedAt = DateTime.UtcNow
    };

    db.Announcements.Add(announcement);
    await db.SaveChangesAsync();

    return announcement;
  }

  public async Task<bool> UpdateAsync(int id, CreateAnnouncementDto dto)
  {
    var announcement = await db.Announcements.FindAsync(id);

    if (announcement is null)
      return false;

    announcement.Title = dto.Title;
    announcement.Body = dto.Body;
    announcement.Category = dto.Category;

    await db.SaveChangesAsync();

    return true;
  }

  public async Task<bool> DeleteAsync(int id)
  {
    var announcement = await db.Announcements.FindAsync(id);

    if (announcement is null)
      return false;

    db.Announcements.Remove(announcement);
    await db.SaveChangesAsync();

    return true;
  }
}
