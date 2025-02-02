using SalonScheduling.Domain.Entities;

namespace SalonScheduling.Domain.Interfaces.Repositories
{
    public interface ISchedulingRepository : IBaseRepository<Scheduling>
    {
        Task<Scheduling?> GetByIdWithIncludes(Guid id);
        Task<Scheduling[]> GetAllWithIncludesAsNoTracking();
    }
}
