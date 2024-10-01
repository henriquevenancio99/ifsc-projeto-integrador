using SalonScheduling.Domain.Entities;

namespace SalonScheduling.Domain.Interfaces.Repositories
{
    public interface IEmployeeRepository : IBaseRepository<Employee>
    {
        Task Update(Guid id, Employee employee);
    }
}
