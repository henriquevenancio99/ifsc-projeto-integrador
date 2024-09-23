namespace SalonScheduling.Domain.ValueObjects
{
    public class Contact
    {
        public required string Email { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
