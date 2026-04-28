using System;
using System.Collections.Generic;

namespace ClinicManagement.API.Models;

public partial class Medicalrecord
{
    public int Id { get; set; }

    public int PatientId { get; set; }

    public int AppointmentId { get; set; }

    public string? Diagnosis { get; set; }

    public string? Treatment { get; set; }

    public string? Notes { get; set; }

    public DateTime? RecordDate { get; set; }

    public virtual Appointment Appointment { get; set; } = null!;

    public virtual Patient Patient { get; set; } = null!;

    public virtual ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
}
