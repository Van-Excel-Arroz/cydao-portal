using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CydaoCabuyao.Server.Models;

namespace CydaoCabuyao.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventRegistrationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EventRegistrationsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/eventregistrations/event/{eventId}
        [HttpGet("event/{eventId}")]
        public async Task<ActionResult<IEnumerable<EventRegistrationEventDto>>> GetRegistrationsForEvent(int eventId)
        {
            var eventRegistrations = await _context.EventRegistrations
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

            return Ok(eventRegistrations);
        }

        // GET: api/eventregistrations/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<EventRegistrationUserDto>>> GetRegistrationsForUser(int userId)
        {
            var userRegistrations = await _context.EventRegistrations
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

            return Ok(userRegistrations);
        }

        // POST: api/eventregistrations
        [HttpPost]
        public async Task<ActionResult<EventRegistration>> CreateRegistration([FromBody] CreateEventRegistrationDto dto)
        {
            var cydaoEvent = await _context.Events.FindAsync(dto.EventId);
            if (cydaoEvent == null)
            {
                return NotFound(new { message = "Event not found." });
            }
            if (!cydaoEvent.IsOpen)
            {
                return BadRequest(new { message = "Event is closed." });
            }

            var alreadyRegistered = await _context.EventRegistrations
                .AnyAsync(r => r.UserId == dto.UserId && r.EventId == dto.EventId);
            
            if (alreadyRegistered)
            {
                return BadRequest(new { message = "User is already registered for this event." });
            }

            var registration = new EventRegistration
            {
                UserId = dto.UserId,
                EventId = dto.EventId,
                CreatedAt = DateTime.UtcNow
            };

            _context.EventRegistrations.Add(registration);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User successfully registered for the event.", id = registration.Id });
        }

        // DELETE: api/eventregistrations/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRegistration(int id)
        {
            var registration = await _context.EventRegistrations.FindAsync(id);
            if (registration == null)
            {
                return NotFound(new { message = "Registration not found." });
            }

            _context.EventRegistrations.Remove(registration);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
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
}