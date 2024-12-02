using SalonScheduling.Domain.Entities;

namespace SalonScheduling.Domain.Interfaces.Repositories
{
    public interface IEmployeeRepository : IBaseRepository<Employee>
    {
        Task<int> UpdateAndCommit(Guid id, Employee employee);
        Task<Employee[]> GetAllWithIncludesAsNoTracking();
        Task CreateWithSalonServices(Employee employee, Guid[]? salonServicesIds);
        Task UpdateWithSalonServices(Employee employee, Guid[]? salonServicesIds);
        Task<Employee?> GetByIdWithSalonService(Guid id);
    }
}
