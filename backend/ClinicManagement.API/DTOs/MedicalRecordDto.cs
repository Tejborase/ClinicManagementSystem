namespace ClinicManagement.API.DTOs;

public class CreateMedicalRecordDto
{
    public int PatientId { get; set; }
    public int AppointmentId { get; set; }
    public string Diagnosis { get; set; } = string.Empty;
    public string Treatment { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}

public class MedicalRecordResponseDto
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public int AppointmentId { get; set; }
    public string Diagnosis { get; set; } = string.Empty;
    public string Treatment { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public DateTime RecordDate { get; set; }
    public List<PrescriptionResponseDto> Prescriptions { get; set; } = new();
}
