using SalonScheduling.Domain.Queries;

namespace SalonScheduling.Domain.Interfaces.QueriesHandlers
{
    public interface IClientQueriesHandlers :
        IQueryHandler<ClientQuery[]>,
        IQueryHandler<Guid, ClientQuery?>
    {
    }
}
