using SalonScheduling.Domain.Interfaces.QueriesHandlers;
using SalonScheduling.Domain.Interfaces.Repositories;

namespace SalonScheduling.Domain.Queries.Handlers
{
    public class EmployeeQueriesHandlers(IEmployeeRepository employeeRepository) : IEmployeeQueriesHandlers
    {
        public async Task<EmployeeQuery[]> Handle()
        {
            var result = await employeeRepository.GetAllAsNoTracking();

            return result
                ?.Select(employee => new EmployeeQuery(
                    employee.Id, 
                    employee.Name, 
                    employee.Contact, 
                    employee.CreatedAt, 
                    employee.UpdatedAt
                ))
                .ToArray() ?? [];
        }

        public async Task<EmployeeQuery?> Handle(Guid id)
        {
            var employee = await employeeRepository.GetById(id);

            if (employee is null)
                return default;

            return new EmployeeQuery(
                employee.Id, 
                employee.Name, 
                employee.Contact, 
                employee.CreatedAt, 
                employee.UpdatedAt
            );
        }
    }
}
