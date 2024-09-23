using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SalonScheduling.Domain.Entities;

namespace SalonScheduling.Data.Mappings
{
    public abstract class BaseMapping<TEntity> : IEntityTypeConfiguration<TEntity> where TEntity : BaseEntity
    {
        public virtual void Configure(EntityTypeBuilder<TEntity> builder)
        {
            builder.HasKey(h => h.Id);

            builder
                .Property(p => p.CreatedAt)
                .HasDefaultValueSql("now()")
                .ValueGeneratedOnAdd();
            
            builder
                .Property(p => p.UpdatedAt)
                .HasDefaultValueSql("now()")
                .ValueGeneratedOnAddOrUpdate();
        }
    }
}
