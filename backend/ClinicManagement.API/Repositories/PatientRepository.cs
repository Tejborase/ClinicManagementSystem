using Microsoft.EntityFrameworkCore;
using ClinicManagement.API.Data;
using ClinicManagement.API.Models;

namespace ClinicManagement.API.Repositories;

public interface IPatientRepository : IGenericRepository<Patient>
{
    Task<Patient?> GetPatientWithDetailsAsync(int id);
    Task<IEnumerable<Patient>> SearchPatientsAsync(string searchTerm);
}

public class PatientRepository : GenericRepository<Patient>, IPatientRepository
{
    public PatientRepository(AppDbContext context) : base(context) { }

    public async Task<Patient?> GetPatientWithDetailsAsync(int id)
        => await _context.Patients
            .Include(p => p.Appointments)
            .Include(p => p.Medicalrecords)
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task<IEnumerable<Patient>> SearchPatientsAsync(string searchTerm)
        => await _context.Patients
            .Where(p => p.FullName.Contains(searchTerm) ||
                        (p.Email != null && p.Email.Contains(searchTerm)) ||
                        (p.Phone != null && p.Phone.Contains(searchTerm)))
            .ToListAsync();
}