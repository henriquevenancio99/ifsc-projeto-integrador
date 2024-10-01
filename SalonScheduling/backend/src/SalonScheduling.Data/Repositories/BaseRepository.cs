using Microsoft.EntityFrameworkCore;
using SalonScheduling.Domain.Entities;
using SalonScheduling.Domain.Interfaces.Repositories;
using System.Linq.Expressions;

namespace SalonScheduling.Data.Repositories
{
    public abstract class BaseRepository<TEntity>(SalonSchedulingContext context) 
        : IBaseRepository<TEntity> where TEntity : BaseEntity
    {
        protected DbSet<TEntity> dbSet = context.Set<TEntity>();

        public async Task<TEntity[]> GetAllAsNoTracking() =>
            await dbSet.AsNoTracking().ToArrayAsync();

        public async Task<TEntity?> GetById(Guid id) =>
            await dbSet.FindAsync(id);

        public async Task Create(TEntity entity) =>
            await dbSet.AddAsync(entity);

        public async Task Delete(Expression<Func<TEntity, bool>> predicate) =>
            await dbSet.Where(predicate).ExecuteDeleteAsync();

        public async Task<bool> ExistsBy(Expression<Func<TEntity, bool>> predicate) =>
            await dbSet.AnyAsync(predicate);

        public async Task Commit() => 
            await context.SaveChangesAsync();
    }
}
