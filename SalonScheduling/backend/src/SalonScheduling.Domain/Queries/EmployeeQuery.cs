using SalonScheduling.Domain.Dtos.Employee;
using SalonScheduling.Domain.ValueObjects;

namespace SalonScheduling.Domain.Queries
{
    public record EmployeeQuery(
        Guid Id, 
        string Name, 
        Contact Contact, 
        DateTimeOffset CreatedAt, 
        DateTimeOffset UpdatedAt, 
        Dictionary<Guid, string>? SalonServices,
        Dictionary<string, WorkShiftDto[]>? Availability) : BaseQuery;
}
