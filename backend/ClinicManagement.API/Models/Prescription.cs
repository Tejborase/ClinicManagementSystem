using System;
using System.Collections.Generic;

namespace ClinicManagement.API.Models;

public partial class Prescription
{
    public int Id { get; set; }

    public int MedicalRecordId { get; set; }

    public string MedicineName { get; set; } = null!;

    public string? Dosage { get; set; }

    public string? Frequency { get; set; }

    public int? DurationDays { get; set; }

    public string? Instructions { get; set; }

    public virtual Medicalrecord MedicalRecord { get; set; } = null!;
}
