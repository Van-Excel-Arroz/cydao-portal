using CydaoCabuyao.Server.DTOs;
using CydaoCabuyao.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CydaoCabuyao.Server.Services;

public interface IProgramService
{
  Task<List<CydaoProgram>> GetAllAsync();
  Task<CydaoProgram?> GetByIdAsync(int id);
  Task<CydaoProgram> CreateAsync(CreateProgramDto dto);
  Task<bool> UpdateAsync(int id, CreateProgramDto dto);
  Task<bool> DeleteAsync(int id);
}

public class ProgramService : IProgramService
{
  private readonly AppDbContext _db;

  public ProgramService(AppDbContext db)
  {
    _db = db;
  }

  public async Task<List<CydaoProgram>> GetAllAsync()
  {
    return await _db.Programs
        .OrderByDescending(p => p.CreatedAt)
        .ToListAsync();
  }

  public async Task<CydaoProgram?> GetByIdAsync(int id)
  {
    return await _db.Programs.FindAsync(id);
  }

  public async Task<CydaoProgram> CreateAsync(CreateProgramDto dto)
  {
    var program = new CydaoProgram
    {
      Title = dto.Title,
      Description = dto.Description,
      Category = dto.Category,
      ApplicationDeadline = dto.ApplicationDeadline,
      IsOpen = dto.IsOpen,
      CreatedAt = DateTime.UtcNow
    };

    _db.Programs.Add(program);
    await _db.SaveChangesAsync();

    return program;
  }

  public async Task<bool> UpdateAsync(int id, CreateProgramDto dto)
  {
    var program = await _db.Programs.FindAsync(id);

    if (program is null)
      return false;

    program.Title = dto.Title;
    program.Description = dto.Description;
    program.Category = dto.Category;
    program.ApplicationDeadline = dto.ApplicationDeadline;
    program.IsOpen = dto.IsOpen;

    await _db.SaveChangesAsync();

    return true;
  }

  public async Task<bool> DeleteAsync(int id)
  {
    var program = await _db.Programs.FindAsync(id);

    if (program is null)
      return false;

    _db.Programs.Remove(program);
    await _db.SaveChangesAsync();

    return true;
  }
}
