using SalonScheduling.Domain.ValueObjects;

namespace SalonScheduling.Domain.Queries
{
    public record ClientQuery(
        Guid Id, 
        string Name, 
        Contact Contact, 
        DateTimeOffset CreatedAt, 
        DateTimeOffset UpdatedAt) : BaseQuery;
}
