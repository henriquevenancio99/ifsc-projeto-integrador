namespace SalonScheduling.Domain.Queries
{
    public record SalonServiceQuery(
        Guid Id, 
        string Name, 
        decimal? Price,
        string? PriceFormatted,
        Dictionary<string, string>? ServiceTypes,
        string? ServiceTime, 
        string? Description, 
        DateTimeOffset CreatedAt,
        DateTimeOffset UpdatedAt) : BaseQuery;
}
