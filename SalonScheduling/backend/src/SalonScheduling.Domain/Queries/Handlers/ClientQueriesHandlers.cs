using SalonScheduling.Domain.Interfaces.QueriesHandlers;
using SalonScheduling.Domain.Interfaces.Repositories;

namespace SalonScheduling.Domain.Queries.Handlers
{
    public class ClientQueriesHandlers(IClientRepository clientRepository) : IClientQueriesHandlers
    {
        public async Task<ClientQuery[]> Handle()
        {
            var result = await clientRepository.GetAllAsNoTracking();

            return result
                ?.Select(client => new ClientQuery(
                    client.Id, 
                    client.Name, 
                    client.Contact, 
                    client.CreatedAt, 
                    client.UpdatedAt
                ))
                .ToArray() ?? [];
        }

        public async Task<ClientQuery?> Handle(Guid id)
        {
            var client = await clientRepository.GetById(id);

            return client is not null 
                ? new(client.Id, client.Name, client.Contact, client.CreatedAt, client.UpdatedAt) 
                : default;
        }
    }
}
