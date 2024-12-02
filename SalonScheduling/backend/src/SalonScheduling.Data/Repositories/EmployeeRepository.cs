using Microsoft.EntityFrameworkCore;
using SalonScheduling.Domain.Entities;
using SalonScheduling.Domain.Interfaces.Repositories;

namespace SalonScheduling.Data.Repositories
{
    public class EmployeeRepository(SalonSchedulingContext context, ISalonServiceRepository salonServiceRepository) 
        : BaseRepository<Employee>(context), IEmployeeRepository
    {
        public async Task<Employee[]> GetAllWithIncludesAsNoTracking() =>
            await dbSet.AsNoTracking().Include(i => i.SalonServices).ToArrayAsync();

        public async Task<int> UpdateAndCommit(Guid id, Employee employee)
        {
            return await dbSet
                .Where(f => f.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(s => s.Name, employee.Name)
                    .SetProperty(s => s.Contact.Email, employee.Contact.Email)
                    .SetProperty(s => s.Contact.PhoneNumber, employee.Contact.PhoneNumber)
                    .SetProperty(s => s.UpdatedAt, DateTimeOffset.UtcNow)
                );
        }

        public async Task<Employee?> GetByIdWithSalonService(Guid id) => 
            await dbSet.Include(i => i.SalonServices).FirstOrDefaultAsync(f => f.Id == id);

        public async Task CreateWithSalonServices(Employee employee, Guid[]? salonServicesIds)
        {
            await BindSalonServices(employee, salonServicesIds);
            await Create(employee);
        }

        public async Task UpdateWithSalonServices(Employee employee, Guid[]? salonServicesIds)
        {
            await BindSalonServices(employee, salonServicesIds);
            await Update(employee);
        }

        private async Task BindSalonServices(Employee employee, Guid[]? salonServicesIds)
        {
            var salonServices = await salonServiceRepository.GetByIds(salonServicesIds);
            employee.SalonServices = salonServices;
        }
    }
}
