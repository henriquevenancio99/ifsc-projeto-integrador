using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using SalonScheduling.Data.Repositories;
using SalonScheduling.Domain.Interfaces.Repositories;
using System.Reflection;

namespace SalonScheduling.Data
{
    public static class DependencyInjection
    {
        public static IServiceCollection ConfigureData(this IServiceCollection services, IConfiguration configuration)
        {
            var dataSource = new NpgsqlDataSourceBuilder(configuration.GetConnectionString(nameof(SalonSchedulingContext)))
                .EnableDynamicJson()
                .Build();

            services.AddDbContext<SalonSchedulingContext>(options =>
            {
                options
                    .UseNpgsql(dataSource, options => options.MigrationsAssembly(Assembly.GetExecutingAssembly().GetName().Name))
                    .UseSnakeCaseNamingConvention();
            });

            services.AddRepositories();

            return services;
        }

        public static void AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<IEmployeeRepository, EmployeeRepository>();
        }
    }
}
