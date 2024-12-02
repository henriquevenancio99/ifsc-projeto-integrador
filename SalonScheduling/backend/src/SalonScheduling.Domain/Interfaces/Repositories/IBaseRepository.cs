using SalonScheduling.Domain.Entities;
using System.Linq.Expressions;

namespace SalonScheduling.Domain.Interfaces.Repositories
{
    public interface IBaseRepository<TEntity>
    {
        Task<TEntity[]> GetAllAsNoTracking();
        Task<TEntity?> GetById(Guid id);
        Task<List<TEntity>> GetByFilters(Expression<Func<TEntity, bool>> predicate);
        Task Create(TEntity employee);
        Task Update(TEntity entity);
        Task Delete(Expression<Func<TEntity, bool>> predicate);
        Task<bool> ExistsBy(Expression<Func<TEntity, bool>> predicate);
        Task<int> Commit();
    }
}
