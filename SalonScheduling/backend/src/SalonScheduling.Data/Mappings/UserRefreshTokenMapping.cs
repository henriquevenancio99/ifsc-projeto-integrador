using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SalonScheduling.Data.Identity;

namespace SalonScheduling.Data.Mappings
{
    public class UserRefreshTokenMapping : IEntityTypeConfiguration<UserRefreshToken>
    {
        public void Configure(EntityTypeBuilder<UserRefreshToken> builder)
        {
            builder.HasKey(h => h.Id);

            builder
               .HasOne(h => h.User)
               .WithOne(w => w.UserRefreshToken)
               .HasForeignKey<UserRefreshToken>(h => h.UserId);
        }
    }
}
