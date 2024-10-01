namespace SalonScheduling.Domain.Interfaces.QueriesHandlers
{
    public interface IQueryHandler<TQueryResponse>
    {
        Task<TQueryResponse> Handle();
    }

    public interface IQueryHandler<TQuery, TQueryResponse>
    {
        Task<TQueryResponse> Handle(TQuery query);
    }
}
