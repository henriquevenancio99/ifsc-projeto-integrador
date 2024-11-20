using SalonScheduling.Domain.Entities;

namespace SalonScheduling.Domain.Interfaces.Repositories
{
    public interface IClientRepository : IBaseRepository<Client>
    {
        Task<int> UpdateAndCommit(Guid id, Client client);
    }
}
