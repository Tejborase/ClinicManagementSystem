using ClinicManagement.API.DTOs;
using ClinicManagement.API.Models;
using ClinicManagement.API.Repositories;

namespace ClinicManagement.API.Services;

public interface IPatientService
{
    Task<IEnumerable<PatientResponseDto>> GetAllAsync();
    Task<PatientResponseDto?> GetByIdAsync(int id);
    Task<PatientResponseDto> CreateAsync(CreatePatientDto dto);
    Task<PatientResponseDto?> UpdateAsync(int id, UpdatePatientDto dto);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<PatientResponseDto>> SearchAsync(string searchTerm);
}

public class PatientService : IPatientService
{
    private readonly IPatientRepository _repo;

    public PatientService(IPatientRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<PatientResponseDto>> GetAllAsync()
    {
        var patients = await _repo.GetAllAsync();
        return patients.Select(MapToDto);
    }

    public async Task<PatientResponseDto?> GetByIdAsync(int id)
    {
        var patient = await _repo.GetPatientWithDetailsAsync(id);
        return patient == null ? null : MapToDto(patient);
    }

    public async Task<PatientResponseDto> CreateAsync(CreatePatientDto dto)
    {
        DateOnly? dateOfBirth = null;
        if (!string.IsNullOrEmpty(dto.DateOfBirth))
        {
            if (DateOnly.TryParseExact(dto.DateOfBirth, "yyyy-MM-dd",
                null, System.Globalization.DateTimeStyles.None, out var parsed))
            {
                dateOfBirth = parsed;
            }
        }

        var patient = new Patient
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Phone = dto.Phone,
            DateOfBirth = dateOfBirth,
            Gender = dto.Gender,
            Address = dto.Address,
            BloodGroup = dto.BloodGroup
        };

        var created = await _repo.CreateAsync(patient);
        return MapToDto(created);
    }

    public async Task<PatientResponseDto?> UpdateAsync(int id, UpdatePatientDto dto)
    {
        var patient = await _repo.GetByIdAsync(id);
        if (patient == null) return null;

        patient.FullName = dto.FullName;
        patient.Email = dto.Email;
        patient.Phone = dto.Phone;
        patient.Address = dto.Address;
        patient.BloodGroup = dto.BloodGroup;

        var updated = await _repo.UpdateAsync(patient);
        return MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(int id)
        => await _repo.DeleteAsync(id);

    public async Task<IEnumerable<PatientResponseDto>> SearchAsync(string searchTerm)
    {
        var patients = await _repo.SearchPatientsAsync(searchTerm);
        return patients.Select(MapToDto);
    }

    private static PatientResponseDto MapToDto(Patient p) => new()
    {
        Id = p.Id,
        FullName = p.FullName,
        Email = p.Email ?? string.Empty,
        Phone = p.Phone ?? string.Empty,
        DateOfBirth = p.DateOfBirth.HasValue
            ? p.DateOfBirth.Value.ToString("yyyy-MM-dd")
            : string.Empty,
        Gender = p.Gender ?? string.Empty,
        Address = p.Address ?? string.Empty,
        BloodGroup = p.BloodGroup ?? string.Empty,
        RegisteredAt = p.RegisteredAt.HasValue
            ? p.RegisteredAt.Value.ToString("yyyy-MM-dd HH:mm:ss")
            : string.Empty
    };
}