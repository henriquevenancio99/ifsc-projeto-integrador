using Microsoft.EntityFrameworkCore;
using SalonScheduling.Domain.Entities;
using SalonScheduling.Domain.Interfaces.Repositories;

namespace SalonScheduling.Data.Repositories
{
    public class ClientRepository(SalonSchedulingContext context) 
        : BaseRepository<Client>(context), IClientRepository
    {
        public async Task<int> UpdateAndCommit(Guid id, Client client)
        {
            return await dbSet
                .Where(f => f.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(s => s.Name, client.Name)
                    .SetProperty(s => s.Contact.Email, client.Contact.Email)
                    .SetProperty(s => s.Contact.PhoneNumber, client.Contact.PhoneNumber)
                    .SetProperty(s => s.UpdatedAt, DateTimeOffset.UtcNow)
                );
        }
    }
}
