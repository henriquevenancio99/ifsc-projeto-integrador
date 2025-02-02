using SalonScheduling.Domain.Queries;

namespace SalonScheduling.Domain.Interfaces.QueriesHandlers
{
    public interface ISchedulingQueriesHandlers :
        IQueryHandler<SchedulingQuery[]>,
        IQueryHandler<Guid, SchedulingQuery?>
    {
    }
}
