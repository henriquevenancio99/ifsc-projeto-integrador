using SalonScheduling.Domain.Queries;

namespace SalonScheduling.Domain.Interfaces.QueriesHandlers
{
    public interface IEmployeeQueriesHandlers :
        IQueryHandler<EmployeeQuery[]>,
        IQueryHandler<Guid, EmployeeQuery?>
    {
    }
}
