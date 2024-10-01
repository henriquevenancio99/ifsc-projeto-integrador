using Microsoft.EntityFrameworkCore;
using SalonScheduling.Domain.Entities;
using SalonScheduling.Domain.Interfaces.Repositories;

namespace SalonScheduling.Data.Repositories
{
    public class EmployeeRepository(SalonSchedulingContext context) 
        : BaseRepository<Employee>(context), IEmployeeRepository
    {
        public async Task Update(Guid id, Employee employee)
        {
            await dbSet
                .Where(f => f.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(s => s.Name, employee.Name)
                    .SetProperty(s => s.Contact.Email, employee.Contact.Email)
                    .SetProperty(s => s.Contact.PhoneNumber, employee.Contact.PhoneNumber)
                    .SetProperty(s => s.UpdatedAt, DateTimeOffset.UtcNow)
                );
        }
    }
}
