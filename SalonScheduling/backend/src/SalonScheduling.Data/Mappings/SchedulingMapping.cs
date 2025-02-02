using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SalonScheduling.Domain.Entities;

namespace SalonScheduling.Data.Mappings
{
    public class SchedulingMapping : BaseMapping<Scheduling>
    {
        public override void Configure(EntityTypeBuilder<Scheduling> builder)
        {
            base.Configure(builder);

            builder
                .HasOne(h => h.Client)
                .WithMany(w => w.Schedulings)
                .HasForeignKey(h => h.ClientId);

            builder
                .HasMany(h => h.Employees)
                .WithMany(w => w.Schedulings);

            builder
                .HasMany(h => h.SalonServices)
                .WithMany(w => w.Schedulings);
        }
    }
}
