using SalonScheduling.Domain.Interfaces.QueriesHandlers;
using SalonScheduling.Domain.Interfaces.Repositories;

namespace SalonScheduling.Domain.Queries.Handlers
{
    public class EmployeeQueriesHandlers(IEmployeeRepository employeeRepository) : IEmployeeQueriesHandlers
    {
        public async Task<EmployeeQuery[]> Handle()
        {
            var result = await employeeRepository.GetAllWithIncludesAsNoTracking();

            return result
                ?.Select(employee => new EmployeeQuery(
                    employee.Id, 
                    employee.Name, 
                    employee.Contact, 
                    employee.CreatedAt, 
                    employee.UpdatedAt,
                    employee.SalonServices?.ToDictionary(key => key.Id, value => value.Name),
                    employee.Availability
                ))
                .ToArray() ?? [];
        }

        public async Task<EmployeeQuery?> Handle(Guid id)
        {
            var employee = await employeeRepository.GetById(id);

            return employee is not null 
                ? new(
                    employee.Id, 
                    employee.Name, 
                    employee.Contact, 
                    employee.CreatedAt, 
                    employee.UpdatedAt,
                    employee.SalonServices?.ToDictionary(key => key.Id, value => value.Name),
                    employee.Availability)
                : default;
        }
    }
}
