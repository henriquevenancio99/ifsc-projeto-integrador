namespace SalonScheduling.Domain.Queries
{
    public record SchedulingQuery(
        Guid Id,
        Guid ClientId,
        Guid[] EmployeesIds,
        Guid[] SalonServicesIds,
        string Start,
        string End
    ) : BaseQuery;
}
