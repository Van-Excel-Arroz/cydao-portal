using CydaoCabuyao.Server.DTOs;
using CydaoCabuyao.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CydaoCabuyao.Server.Services;

public interface IApplicationService
{
  Task<List<Application>> GetAllAsync();
  Task<List<Application>?> GetByUserAsync(int userId);
  Task<(bool Success, string? Error, int StatusCode, Application? Data)> CreateAsync(CreateApplicationDto dto);
  Task<bool> UpdateStatusAsync(int id, ApplicationStatusUpdateDto dto);
}

public class ApplicationService : IApplicationService
{
  private readonly AppDbContext _db;

  public ApplicationService(AppDbContext db)
  {
    _db = db;
  }

  public async Task<List<Application>> GetAllAsync()
  {
    return await _db.Applications
        .Include(a => a.User)
        .Include(a => a.Program)
        .OrderByDescending(a => a.CreatedAt)
        .ToListAsync();
  }

  public async Task<List<Application>?> GetByUserAsync(int userId)
  {
    var userExists = await _db.Users.AnyAsync(u => u.Id == userId);

    if (!userExists)
      return null;

    return await _db.Applications
        .Where(a => a.UserId == userId)
        .Include(a => a.Program)
        .OrderByDescending(a => a.CreatedAt)
        .ToListAsync();
  }

  public async Task<(bool Success, string? Error, int StatusCode, Application? Data)> CreateAsync(CreateApplicationDto dto)
  {
    var programExists = await _db.Programs.AnyAsync(p => p.Id == dto.ProgramId);
    if (!programExists)
      return (false, "Program not found.", 400, null);

    var userExists = await _db.Users.AnyAsync(u => u.Id == dto.UserId);
    if (!userExists)
      return (false, "User not found.", 400, null);

    var duplicate = await _db.Applications
        .AnyAsync(a => a.UserId == dto.UserId && a.ProgramId == dto.ProgramId);
    if (duplicate)
      return (false, "User has already applied to this program.", 409, null);

    var application = new Application
    {
      UserId = dto.UserId,
      ProgramId = dto.ProgramId,
      Status = ApplicationStatus.Pending,
      CreatedAt = DateTime.UtcNow
    };

    _db.Applications.Add(application);
    await _db.SaveChangesAsync();

    return (true, null, 201, application);
  }

  public async Task<bool> UpdateStatusAsync(int id, ApplicationStatusUpdateDto dto)
  {
    var application = await _db.Applications.FindAsync(id);

    if (application is null)
      return false;

    application.Status = dto.Status;
    await _db.SaveChangesAsync();

    return true;
  }
}
