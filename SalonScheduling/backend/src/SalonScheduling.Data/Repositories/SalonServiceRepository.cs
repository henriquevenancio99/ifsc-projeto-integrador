using Microsoft.EntityFrameworkCore;
using SalonScheduling.Domain.Entities;
using SalonScheduling.Domain.Interfaces.Repositories;

namespace SalonScheduling.Data.Repositories
{
    public class SalonServiceRepository(SalonSchedulingContext context) 
        : BaseRepository<SalonService>(context), ISalonServiceRepository
    {
        public async Task<int> UpdateAndCommit(Guid id, SalonService salonService)
        {
            return await dbSet
                .Where(f => f.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(s => s.Name, salonService.Name)
                    .SetProperty(s => s.Price, salonService.Price)
                    .SetProperty(s => s.ServiceTypes, salonService.ServiceTypes)
                    .SetProperty(s => s.ServiceTime, salonService.ServiceTime)
                    .SetProperty(s => s.Description, salonService.Description)
                    .SetProperty(s => s.UpdatedAt, DateTimeOffset.UtcNow)
                );
        }
    }
}
