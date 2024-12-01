using SalonScheduling.Domain.Interfaces.QueriesHandlers;
using SalonScheduling.Domain.Interfaces.Repositories;

namespace SalonScheduling.Domain.Queries.Handlers
{
    public class SalonServiceTypeQueriesHandlers(ISalonServiceTypeRepository salonServiceTypeRepository) 
        : ISalonServiceTypeQueriesHandlers
    {
        public async Task<Dictionary<string, string>> Handle()
        {
            var result = await salonServiceTypeRepository.GetAllAsNoTracking();
            return result?.ToDictionary(t => t.Key, t => t.Name) ?? [];
        }
    }
}
