using System;
using System.Collections.Generic;

namespace ClinicManagement.API.Models;

public partial class Doctor
{
    public int Id { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Specialization { get; set; }

    public int? DepartmentId { get; set; }

    public decimal? ConsultationFee { get; set; }

    public bool? IsAvailable { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual Department? Department { get; set; }
}
