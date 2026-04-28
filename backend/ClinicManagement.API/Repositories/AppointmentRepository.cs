using Microsoft.EntityFrameworkCore;
using ClinicManagement.API.Data;
using ClinicManagement.API.Models;

namespace ClinicManagement.API.Repositories;

public interface IAppointmentRepository : IGenericRepository<Appointment>
{
    Task<IEnumerable<Appointment>> GetAllWithDetailsAsync();
    Task<Appointment?> GetWithDetailsAsync(int id);
    Task<IEnumerable<Appointment>> GetByPatientIdAsync(int patientId);
    Task<IEnumerable<Appointment>> GetByDoctorIdAsync(int doctorId);
}

public class AppointmentRepository : GenericRepository<Appointment>, IAppointmentRepository
{
    public AppointmentRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Appointment>> GetAllWithDetailsAsync()
        => await _context.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
            .OrderByDescending(a => a.AppointmentDate)
            .ToListAsync();

    public async Task<Appointment?> GetWithDetailsAsync(int id)
        => await _context.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
            .FirstOrDefaultAsync(a => a.Id == id);

    public async Task<IEnumerable<Appointment>> GetByPatientIdAsync(int patientId)
        => await _context.Appointments
            .Include(a => a.Doctor)
            .Where(a => a.PatientId == patientId)
            .ToListAsync();

    public async Task<IEnumerable<Appointment>> GetByDoctorIdAsync(int doctorId)
        => await _context.Appointments
            .Include(a => a.Patient)
            .Where(a => a.DoctorId == doctorId)
            .ToListAsync();
}
