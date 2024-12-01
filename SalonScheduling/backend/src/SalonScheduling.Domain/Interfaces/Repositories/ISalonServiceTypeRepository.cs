using SalonScheduling.Domain.Entities;

namespace SalonScheduling.Domain.Interfaces.Repositories
{
    public interface ISalonServiceTypeRepository : IBaseRepository<SalonServiceType>
    {
        Task<int> UpdateAndCommit(string key, SalonServiceType salonServiceType);
    }
}
