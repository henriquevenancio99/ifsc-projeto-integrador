using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SalonScheduling.Domain.Entities;

namespace SalonScheduling.Data.Mappings
{
    public class ClientMapping : BaseMapping<Client>
    {
        public override void Configure(EntityTypeBuilder<Client> builder)
        {
            base.Configure(builder);
            builder.OwnsOne(p => p.Contact);
        }
    }
}
