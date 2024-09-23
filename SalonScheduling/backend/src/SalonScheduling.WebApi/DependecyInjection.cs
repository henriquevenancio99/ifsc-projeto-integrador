using Microsoft.Extensions.DependencyInjection;
using SalonScheduling.Data;

namespace SalonScheduling.WebApi
{
    public static class DependecyInjection
    {
        public static IServiceCollection ConfigureWebApi(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddControllers();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            services
                .AddHealthChecks()
                .AddNpgSql(
                    connectionString: configuration.GetConnectionString(nameof(SalonSchedulingContext))!, 
                    timeout: TimeSpan.FromSeconds(15)
                );

            return services;
        }
    }
}
