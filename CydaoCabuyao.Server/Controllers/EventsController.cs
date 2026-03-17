using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CydaoCabuyao.Server.Models;

namespace CydaoCabuyao.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EventsController (AppDbContext context)
        {
            _context = context;
        }

        // GET /api/events
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CydaoEvent>>> GetEvents()
        {
            var cydaoEvents = await _context.Events.OrderByDescending(e => e.StartDate).ToListAsync();
            return Ok(cydaoEvents);
        }

        // Get /api/events/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CydaoEvent>> GetEvent(int id)
        {
            var cydaoEvent = await _context.Events.FindAsync(id);
            if (cydaoEvent == null)
            {
                return NotFound(new {message = "Event not found."});
            }

            return Ok(cydaoEvent);
        }

        // POST: api/events
        [HttpPost]
        public async Task<ActionResult<CydaoEvent>> CreateEvent([FromBody] CreateEventDto dto)
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

            _context.Events.Add(cydaoEvent);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvent), new { id = cydaoEvent.Id }, cydaoEvent);
        }

        // PUT: api/events/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(int id, [FromBody] CreateEventDto dto)
        {
            var existingEvent = await _context.Events.FindAsync(id);

            if (existingEvent == null)
            {
                return NotFound(new { message = "Event not found." });
            }

            existingEvent.Title = dto.Title;
            existingEvent.Description = dto.Description;
            existingEvent.StartDate = dto.StartDate;
            existingEvent.EndDate = dto.EndDate;
            existingEvent.Venue = dto.Venue;
            existingEvent.AvailableSlots = dto.AvailableSlots;
            existingEvent.IsOpen = dto.IsOpen;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventExists(id))
                {
                    return NotFound(new { message = "Event not found." });
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/events/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var cydaoEvent = await _context.Events.FindAsync(id);
            if (cydaoEvent == null)
            {
                return NotFound(new { message = "Event not found." });
            }

            _context.Events.Remove(cydaoEvent);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EventExists(int id)
        {
            return _context.Events.Any(e => e.Id == id);
        }
    }

     public class CreateEventDto
        {
            public string Title {get; set;} = string.Empty;
            public string Description { get; set; } = string.Empty;
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }
            public string Venue { get; set; } = string.Empty;
            public int AvailableSlots { get; set; }
            public bool IsOpen { get; set; }
        }
}