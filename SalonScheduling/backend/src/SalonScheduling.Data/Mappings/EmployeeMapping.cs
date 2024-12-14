using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SalonScheduling.Domain.Entities;

namespace SalonScheduling.Data.Mappings
{
    public class EmployeeMapping : BaseMapping<Employee>
    {
        public override void Configure(EntityTypeBuilder<Employee> builder)
        {
            base.Configure(builder);
            builder.OwnsOne(p => p.Contact);
            builder
                .Property(e => e.Availability)
                .HasColumnType("jsonb");
            builder
                .HasMany(h => h.SalonServices)
                .WithMany(w => w.Employees);
        }
    }
}
