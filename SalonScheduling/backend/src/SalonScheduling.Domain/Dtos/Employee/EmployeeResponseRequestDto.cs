using SalonScheduling.Domain.ValueObjects;

namespace SalonScheduling.Domain.Dtos.Employee
{
    public record EmployeeResponseRequestDto(Guid id, string Name, Contact Contact, DateTimeOffset createdAt, DateTimeOffset updatedAt);
}
