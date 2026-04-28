using System;
using System.Collections.Generic;

namespace ClinicManagement.API.Models;

public partial class Bill
{
    public int Id { get; set; }

    public int AppointmentId { get; set; }

    public decimal? ConsultationFee { get; set; }

    public decimal? MedicineCost { get; set; }

    public decimal? OtherCharges { get; set; }

    public decimal? TotalAmount { get; set; }

    public string? PaymentStatus { get; set; }

    public string? PaymentMethod { get; set; }

    public DateTime? BilledAt { get; set; }

    public virtual Appointment Appointment { get; set; } = null!;
}
