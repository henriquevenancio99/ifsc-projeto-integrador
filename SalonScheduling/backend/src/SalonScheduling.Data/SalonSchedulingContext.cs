using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Reflection;

namespace SalonScheduling.Data
{
    public class SalonSchedulingContext(DbContextOptions<SalonSchedulingContext> options, IConfiguration configuration) 
        : DbContext(options)
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
