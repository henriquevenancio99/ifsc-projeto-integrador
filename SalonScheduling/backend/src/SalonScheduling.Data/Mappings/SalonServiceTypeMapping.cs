using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SalonScheduling.Domain.Entities;

namespace SalonScheduling.Data.Mappings
{
    public class SalonServiceTypeMapping : IEntityTypeConfiguration<SalonServiceType>
    {
        public void Configure(EntityTypeBuilder<SalonServiceType> builder)
        {
            builder.HasKey(h => h.Key);
        }
    }
}
