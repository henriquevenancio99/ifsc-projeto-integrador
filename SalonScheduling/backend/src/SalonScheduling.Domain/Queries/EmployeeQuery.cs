using SalonScheduling.Domain.ValueObjects;

namespace SalonScheduling.Domain.Queries
{
    public record EmployeeQuery(
        Guid Id, 
        string Name, 
        Contact Contact, 
        DateTimeOffset CreatedAt, 
        DateTimeOffset UpdatedAt, 
        string[]? SalonServices) : BaseQuery;
}
