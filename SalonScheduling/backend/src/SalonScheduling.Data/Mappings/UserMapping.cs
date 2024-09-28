using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SalonScheduling.Data.Identity;

namespace SalonScheduling.Data.Mappings
{
    public class UserMapping : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder
               .HasMany(p => p.Employees)
               .WithOne()
               .HasForeignKey(h => h.UserId);
            
            builder
               .HasMany(p => p.UserRoles)
               .WithOne(w => w.User)
               .HasForeignKey(h => h.UserId);
        }
    }
}
