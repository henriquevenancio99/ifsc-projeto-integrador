using SalonScheduling.Domain.Queries;

namespace SalonScheduling.Domain.Interfaces.QueriesHandlers
{
    public interface ISalonServiceQueriesHandlers :
        IQueryHandler<SalonServiceQuery[]>,
        IQueryHandler<Guid, SalonServiceQuery?>
    {
    }
}
