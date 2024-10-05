using SalonScheduling.Domain.Entities;

namespace SalonScheduling.Domain.Interfaces.Repositories
{
    public interface IEmployeeRepository : IBaseRepository<Employee>
    {
        Task<int> UpdateAndCommit(Guid id, Employee employee);
    }
}
