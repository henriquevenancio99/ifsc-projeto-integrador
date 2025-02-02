using Microsoft.EntityFrameworkCore;
using SalonScheduling.Domain.Entities;
using SalonScheduling.Domain.Interfaces.Repositories;

namespace SalonScheduling.Data.Repositories
{
    public class SchedulingRepository(SalonSchedulingContext context) 
        : BaseRepository<Scheduling>(context), ISchedulingRepository
    {
        public async Task<Scheduling[]> GetAllWithIncludesAsNoTracking() =>
           await dbSet
            .AsNoTracking()
            .Include(i => i.Client)
            .Include(i => i.Employees)
            .Include(i => i.SalonServices)
            .ToArrayAsync();

        public async Task<int> UpdateAndCommit(Guid id, Scheduling scheduling)
        {
            return await dbSet
                .Where(f => f.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(s => s.UpdatedAt, DateTimeOffset.UtcNow)
                );
        }

        public async Task<Scheduling?> GetByIdWithIncludes(Guid id) =>
            await dbSet
                .Include(i => i.Client)
                .Include(i => i.Employees)
                .Include(i => i.SalonServices)
                .FirstOrDefaultAsync(f => f.Id == id);
    }
}
