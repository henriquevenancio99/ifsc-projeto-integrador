using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SalonScheduling.Data.Identity;

namespace SalonScheduling.Data.Mappings
{
    public class RoleMapping : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {
            builder
               .HasMany(p => p.UserRoles)
               .WithOne(w => w.Role)
               .HasForeignKey(h => h.RoleId);
        }
    }
}
