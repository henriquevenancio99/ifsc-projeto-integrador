using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SalonScheduling.Domain.Entities;
using System.Text.Json;

namespace SalonScheduling.Data.Mappings
{
    public class SalonServiceMapping : BaseMapping<SalonService>
    {
        public override void Configure(EntityTypeBuilder<SalonService> builder)
        {
            base.Configure(builder);

            builder
                .Property(e => e.ServiceTypes)
                .HasColumnType("jsonb")
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => 
                        JsonSerializer.Deserialize<SalonServiceType[]>(v, (JsonSerializerOptions?)null) ??
                        Array.Empty<SalonServiceType>()
                )
                .Metadata.SetValueComparer(new ValueComparer<SalonServiceType[]>
                (
                    (c1, c2) => (c1 ?? Array.Empty<SalonServiceType>()).SequenceEqual(c2 ?? Array.Empty<SalonServiceType>()),
                    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => c.ToArray()
                ));
        }
    }
}
