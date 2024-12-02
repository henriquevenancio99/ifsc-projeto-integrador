using SalonScheduling.Domain.ValueObjects;

namespace SalonScheduling.Domain.Dtos.Employee
{
    public record UpdateEmployeeRequestBodyDto(string Name, Contact Contact, Guid[]? SalonServicesIds);
}
