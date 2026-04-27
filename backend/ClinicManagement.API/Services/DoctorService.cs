using ClinicManagement.API.DTOs;
using ClinicManagement.API.Models;
using ClinicManagement.API.Repositories;

namespace ClinicManagement.API.Services;

public interface IDoctorService
{
    Task<IEnumerable<DoctorResponseDto>> GetAllAsync();
    Task<DoctorResponseDto?> GetByIdAsync(int id);
    Task<DoctorResponseDto> CreateAsync(CreateDoctorDto dto);
    Task<DoctorResponseDto?> UpdateAsync(int id, UpdateDoctorDto dto);
    Task<bool> DeleteAsync(int id);
}

public class DoctorService : IDoctorService
{
    private readonly IDoctorRepository _repo;

    public DoctorService(IDoctorRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<DoctorResponseDto>> GetAllAsync()
    {
        var doctors = await _repo.GetDoctorsWithDepartmentAsync();
        return doctors.Select(MapToDto);
    }

    public async Task<DoctorResponseDto?> GetByIdAsync(int id)
    {
        var doctor = await _repo.GetDoctorWithDetailsAsync(id);
        return doctor == null ? null : MapToDto(doctor);
    }

    public async Task<DoctorResponseDto> CreateAsync(CreateDoctorDto dto)
    {
        var doctor = new Doctor
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Phone = dto.Phone,
            Specialization = dto.Specialization,
            DepartmentId = dto.DepartmentId,
            ConsultationFee = dto.ConsultationFee,
            IsAvailable = true
        };
        var created = await _repo.CreateAsync(doctor);
        return MapToDto(created);
    }

    public async Task<DoctorResponseDto?> UpdateAsync(int id, UpdateDoctorDto dto)
    {
        var doctor = await _repo.GetByIdAsync(id);
        if (doctor == null) return null;

        doctor.FullName = dto.FullName;
        doctor.Phone = dto.Phone;
        doctor.Specialization = dto.Specialization;
        doctor.ConsultationFee = dto.ConsultationFee;
        doctor.IsAvailable = dto.IsAvailable;

        var updated = await _repo.UpdateAsync(doctor);
        return MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(int id)
        => await _repo.DeleteAsync(id);

    private static DoctorResponseDto MapToDto(Doctor d) => new()
    {
        Id = d.Id,
        FullName = d.FullName,
        Email = d.Email,
        Phone = d.Phone ?? string.Empty,
        Specialization = d.Specialization ?? string.Empty,
        Department = d.Department?.Name ?? string.Empty,
        ConsultationFee = d.ConsultationFee ?? 0,
        IsAvailable = d.IsAvailable ?? true
    };
}
