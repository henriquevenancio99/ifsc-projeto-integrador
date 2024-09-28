using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Npgsql;
using SalonScheduling.Data.Identity;
using System.Reflection;

namespace SalonScheduling.Data
{
    public class SalonSchedulingContext(DbContextOptions<SalonSchedulingContext> options, IConfiguration configuration) 
        : IdentityDbContext<User, Role, Guid, IdentityUserClaim<Guid>, UserRole, IdentityUserLogin<Guid>, IdentityRoleClaim<Guid>, IdentityUserToken<Guid>>(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (optionsBuilder.IsConfigured)
                return;

            var dataSource = new NpgsqlDataSourceBuilder(configuration.GetConnectionString(nameof(SalonSchedulingContext)))
                .EnableDynamicJson()
                .Build();

            optionsBuilder
                .UseNpgsql(dataSource, options => options.MigrationsAssembly(Assembly.GetExecutingAssembly().GetName().Name))
                .UseSnakeCaseNamingConvention();
        }
    }
}
