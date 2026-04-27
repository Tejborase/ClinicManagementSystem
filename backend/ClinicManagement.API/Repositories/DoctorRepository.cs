using Microsoft.EntityFrameworkCore;
using ClinicManagement.API.Data;
using ClinicManagement.API.Models;

namespace ClinicManagement.API.Repositories;

public interface IDoctorRepository : IGenericRepository<Doctor>
{
    Task<IEnumerable<Doctor>> GetDoctorsWithDepartmentAsync();
    Task<Doctor?> GetDoctorWithDetailsAsync(int id);
}

public class DoctorRepository : GenericRepository<Doctor>, IDoctorRepository
{
    public DoctorRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Doctor>> GetDoctorsWithDepartmentAsync()
        => await _context.Doctors
            .Include(d => d.Department)
            .ToListAsync();

    public async Task<Doctor?> GetDoctorWithDetailsAsync(int id)
        => await _context.Doctors
            .Include(d => d.Department)
            .Include(d => d.Appointments)
            .FirstOrDefaultAsync(d => d.Id == id);
}
