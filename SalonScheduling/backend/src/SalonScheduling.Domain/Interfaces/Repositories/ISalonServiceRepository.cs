using SalonScheduling.Domain.Entities;

namespace SalonScheduling.Domain.Interfaces.Repositories
{
    public interface ISalonServiceRepository : IBaseRepository<SalonService>
    {
        Task<List<SalonService>> GetByIds(Guid[]? salonServicesIds);
        Task<int> UpdateAndCommit(Guid id, SalonService salonService);
    }
}
