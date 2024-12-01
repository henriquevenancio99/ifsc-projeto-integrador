using Microsoft.EntityFrameworkCore;
using SalonScheduling.Domain.Entities;
using SalonScheduling.Domain.Interfaces.Repositories;

namespace SalonScheduling.Data.Repositories
{
    public class SalonServiceTypeRepository(SalonSchedulingContext context) 
        : BaseRepository<SalonServiceType>(context), ISalonServiceTypeRepository
    {
        public async Task<int> UpdateAndCommit(string key, SalonServiceType salonServiceType)
        {
            return await dbSet
                .Where(f => f.Key == key)
                .ExecuteUpdateAsync(setters => setters.SetProperty(s => s.Name, salonServiceType.Name));
        }
    }
}
