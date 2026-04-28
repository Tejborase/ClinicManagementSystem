using ClinicManagement.API.DTOs;
using ClinicManagement.API.Models;
using ClinicManagement.API.Repositories;

namespace ClinicManagement.API.Services;

public interface IAppointmentService
{
    Task<IEnumerable<AppointmentResponseDto>> GetAllAsync();
    Task<AppointmentResponseDto?> GetByIdAsync(int id);
    Task<AppointmentResponseDto> CreateAsync(CreateAppointmentDto dto);
    Task<AppointmentResponseDto?> UpdateAsync(int id, UpdateAppointmentDto dto);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<AppointmentResponseDto>> GetByPatientIdAsync(int patientId);
    Task<IEnumerable<AppointmentResponseDto>> GetByDoctorIdAsync(int doctorId);
}

public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _repo;

    public AppointmentService(IAppointmentRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<AppointmentResponseDto>> GetAllAsync()
    {
        var list = await _repo.GetAllWithDetailsAsync();
        return list.Select(MapToDto);
    }

    public async Task<AppointmentResponseDto?> GetByIdAsync(int id)
    {
        var a = await _repo.GetWithDetailsAsync(id);
        return a == null ? null : MapToDto(a);
    }

    public async Task<AppointmentResponseDto> CreateAsync(CreateAppointmentDto dto)
    {
        var appointment = new Appointment
        {
            PatientId = dto.PatientId,
            DoctorId = dto.DoctorId,
            AppointmentDate = dto.AppointmentDate,
            TimeSlot = dto.TimeSlot,
            Notes = dto.Notes,
            Status = "Scheduled"
        };
        var created = await _repo.CreateAsync(appointment);
        var withDetails = await _repo.GetWithDetailsAsync(created.Id);
        return MapToDto(withDetails!);
    }

    public async Task<AppointmentResponseDto?> UpdateAsync(int id, UpdateAppointmentDto dto)
    {
        var appointment = await _repo.GetByIdAsync(id);
        if (appointment == null) return null;

        appointment.AppointmentDate = dto.AppointmentDate;
        appointment.TimeSlot = dto.TimeSlot;
        appointment.Status = dto.Status;
        appointment.Notes = dto.Notes;

        await _repo.UpdateAsync(appointment);
        var withDetails = await _repo.GetWithDetailsAsync(id);
        return MapToDto(withDetails!);
    }

    public async Task<bool> DeleteAsync(int id)
        => await _repo.DeleteAsync(id);

    public async Task<IEnumerable<AppointmentResponseDto>> GetByPatientIdAsync(int patientId)
    {
        var list = await _repo.GetByPatientIdAsync(patientId);
        return list.Select(MapToDto);
    }

    public async Task<IEnumerable<AppointmentResponseDto>> GetByDoctorIdAsync(int doctorId)
    {
        var list = await _repo.GetByDoctorIdAsync(doctorId);
        return list.Select(MapToDto);
    }

    private static AppointmentResponseDto MapToDto(Appointment a) => new()
    {
        Id = a.Id,
        PatientId = a.PatientId,
        PatientName = a.Patient?.FullName ?? string.Empty,
        DoctorId = a.DoctorId,
        DoctorName = a.Doctor?.FullName ?? string.Empty,
        AppointmentDate = a.AppointmentDate,
        TimeSlot = a.TimeSlot ?? string.Empty,
        Status = a.Status ?? string.Empty,
        Notes = a.Notes ?? string.Empty,
        CreatedAt = a.CreatedAt ?? DateTime.UtcNow
    };
}
